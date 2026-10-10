/* global firebase */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

fetch('/firebase-sdk-config.json')
  .then((response) => response.json())
  .then((config) => {
    firebase.initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    });
    firebase.messaging().onBackgroundMessage((payload) => {
      const title = payload.notification?.title || payload.data?.title || 'Car Clean Plus';
      const body = payload.notification?.body || payload.data?.body || '';
      self.registration.showNotification(title, { body });
    });
  });
