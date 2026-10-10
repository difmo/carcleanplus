import { BASE_URL, fetchWithAuth } from './api';
import sdkConfig from '../firebase-sdk-config.json';

export const AUTH_EVENT = 'ccp-auth';

const firebaseConfig = () => {
  if (!sdkConfig?.apiKey || !sdkConfig?.projectId || !sdkConfig?.appId) return null;
  return {
    apiKey: sdkConfig.apiKey,
    authDomain: sdkConfig.authDomain,
    projectId: sdkConfig.projectId,
    storageBucket: sdkConfig.storageBucket,
    messagingSenderId: sdkConfig.messagingSenderId,
    appId: sdkConfig.appId,
  };
};

export const pushIsConfigured = () => Boolean(
  firebaseConfig() && import.meta.env.VITE_FIREBASE_VAPID_KEY
);

export const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const enableWebPush = async () => {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    throw new Error('This browser cannot show alerts');
  }
  if (!pushIsConfigured()) {
    throw new Error('Browser alerts are not configured yet');
  }
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Alerts are blocked in the browser');
  }

  const { initializeApp, getApps } = await import('firebase/app');
  const { getMessaging, getToken } = await import('firebase/messaging');
  const config = firebaseConfig();
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  const token = await getToken(getMessaging(app), {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });
  if (!token) throw new Error('Could not register this browser');

  await fetchWithAuth('/api/account/push-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  localStorage.setItem('ccp-push-token', token);
  return token;
};

export const clearWebPush = () => {
  const pushToken = localStorage.getItem('ccp-push-token');
  const auth = localStorage.getItem('token');
  localStorage.removeItem('ccp-push-token');
  if (!pushToken || !auth) return;
  fetch(`${BASE_URL}/api/account/push-token`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth}`,
    },
    body: JSON.stringify({ token: pushToken }),
  }).catch(() => {});
};
