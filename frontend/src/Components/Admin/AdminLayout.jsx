import React, { useEffect } from 'react';
import { FiCalendar, FiHome, FiImage, FiLogOut, FiMail } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import img from '../../assets/carcleanplus.logo.jpeg';
import NotificationBell from '../NotificationBell';
import { clearWebPush, emitAuthChange } from '../../utils/push';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin' && user.role !== 'superadmin') {
        navigate('/'); // Not an admin
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    clearWebPush();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    emitAuthChange();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FiCalendar /> },
    { name: 'Festival Offers', path: '/admin/festivals', icon: <HiOutlineSparkles /> },
    { name: 'Messages', path: '/admin/contacts', icon: <FiMail /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <FiImage /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="h-24 flex items-center justify-center border-b border-gray-100 px-4">
          <Link to="/">
            <img src={img} alt="Car Clean Plus" className="h-16 w-auto object-contain" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 min-h-[44px] rounded-2xl transition-all font-bold text-[15px] ${isActive
                      ? 'bg-[#E8F0FE] text-[#1D4ED8]'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                    }`}
                >
                  <span className="icon-circle">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400">Alerts</span>
            <NotificationBell dropUp />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[15px]"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-100 md:hidden">
          <div className="h-16 flex items-center justify-between px-4">
            <Link to="/" className="min-h-[40px] inline-flex items-center">
              <img src={img} alt="Car Clean Plus" className="h-8 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button onClick={handleLogout} className="icon-circle text-red-600" aria-label="Logout">
                <FiLogOut />
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-3 pb-3">
            {navItems.map((item) => {
              const isActive = item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`shrink-0 inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full text-sm font-bold ${isActive ? 'bg-[#1D4ED8] text-white' : 'bg-[#E8F0FE] text-[#1D4ED8]'}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
