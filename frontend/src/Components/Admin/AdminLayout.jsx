import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaSignOutAlt, FaCar, FaEnvelope } from 'react-icons/fa';
import img from '../../assets/logo car clean.png';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaHome /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FaCalendarAlt /> },
    { name: 'Messages', path: '/admin/contacts', icon: <FaEnvelope /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="h-20 flex items-center justify-center border-b border-gray-100 px-6">
          <Link to="/">
            <img src={img} alt="Car Clean Plus" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[15px] ${
                    isActive 
                      ? 'bg-blue-50 text-[#0052cc]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-[15px]"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:hidden">
          <Link to="/">
            <img src={img} alt="Car Clean Plus" className="h-8 w-auto object-contain" />
          </Link>
          <button onClick={handleLogout} className="text-gray-600 hover:text-red-600">
            <FaSignOutAlt className="text-xl" />
          </button>
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
