import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../utils/api';
import { AUTH_EVENT, enableWebPush, pushIsConfigured } from '../utils/push';

const readUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const timeAgo = (value) => {
  const then = new Date(value).getTime();
  if (!then) return '';
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = ({ dropUp = false }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [user, setUser] = useState(readUser);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [pushState, setPushState] = useState('idle');
  const [pushError, setPushError] = useState('');

  const refreshUser = useCallback(() => {
    setUser(readUser());
  }, []);

  const load = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setItems([]);
      setUnread(0);
      return;
    }
    try {
      const data = await fetchWithAuth('/api/account/notifications');
      setItems(data.data || []);
      setUnread(data.unread || 0);
    } catch {
      setItems([]);
      setUnread(0);
    }
  }, []);

  useEffect(() => {
    refreshUser();
    load();
    const timer = setInterval(load, 25000);
    window.addEventListener(AUTH_EVENT, refreshUser);
    window.addEventListener('storage', refreshUser);
    window.addEventListener('focus', load);
    return () => {
      clearInterval(timer);
      window.removeEventListener(AUTH_EVENT, refreshUser);
      window.removeEventListener('storage', refreshUser);
      window.removeEventListener('focus', load);
    };
  }, [load, refreshUser]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  if (!user) return null;

  const openPanel = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      try {
        await fetchWithAuth('/api/account/notifications/read', { method: 'PUT', body: '{}' });
        setUnread(0);
        setItems((current) => current.map((item) => ({ ...item, read: true })));
      } catch {
        // The list still opens if marking read fails.
      }
    }
  };

  const turnOnAlerts = async () => {
    setPushError('');
    setPushState('working');
    try {
      await enableWebPush();
      setPushState('on');
    } catch (error) {
      setPushState('idle');
      setPushError(error.message || 'Could not turn on alerts');
    }
  };

  const openItem = (item) => {
    setOpen(false);
    const isDesk = user.role === 'admin' || user.role === 'superadmin';
    if (item.booking && isDesk) navigate('/admin/bookings');
  };

  const alertsReady = typeof Notification !== 'undefined' && Notification.permission === 'granted' && localStorage.getItem('ccp-push-token');
  const canAsk = pushIsConfigured() && typeof Notification !== 'undefined' && Notification.permission !== 'denied' && !alertsReady;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={openPanel}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
        aria-label={unread ? `${unread} unread alerts` : 'Alerts'}
      >
        <FiBell />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#d31225] text-white text-[10px] font-bold leading-[18px]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute right-0 z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-gray-100 bg-white shadow-xl ${dropUp ? 'bottom-12' : 'top-12'}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">Alerts</p>
            <p className="text-xs font-semibold text-gray-400">{unread ? `${unread} new` : 'Up to date'}</p>
          </div>

          {canAsk && (
            <div className="px-4 py-3 border-b border-gray-100 bg-[#E8F0FE]">
              <button
                type="button"
                onClick={turnOnAlerts}
                disabled={pushState === 'working'}
                className="text-sm font-bold text-[#1D4ED8]"
              >
                {pushState === 'working' ? 'Turning on…' : 'Allow browser alerts'}
              </button>
              {pushError && <p className="mt-1 text-xs text-red-600">{pushError}</p>}
            </div>
          )}

          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 && (
              <p className="px-4 py-6 text-sm text-gray-500">No alerts yet. Booking updates will show up here.</p>
            )}
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => openItem(item)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 ${item.read ? '' : 'bg-blue-50/60'}`}
              >
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                {item.body && <p className="mt-0.5 text-xs text-gray-600 line-clamp-2">{item.body}</p>}
                <p className="mt-1 text-[11px] font-semibold text-gray-400">{timeAgo(item.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
