import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEnvelope, FaRupeeSign, FaSpinner, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { fetchWithAuth } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/api/admin/dashboard');
      setStats(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <FaSpinner className="animate-spin text-4xl mb-4 text-[#0052cc]" />
        <p className="font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="font-bold text-lg">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: <FaRupeeSign />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <FaCalendarAlt />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Pending Action',
      value: stats.pendingBookings,
      icon: <FaClock />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'New Inquiries',
      value: stats.totalInquiries,
      icon: <FaEnvelope />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    }
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6">
      
      {/* Premium Dark Welcome Banner */}
      <div className="bg-gray-900 rounded-2xl p-6 relative overflow-hidden shadow-lg border border-gray-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-1">Overview Dashboard</h1>
            <p className="text-gray-400 text-[13px] font-medium">
              Monitor your business metrics, recent bookings, and customer inquiries in real-time.
            </p>
          </div>
          <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md self-start sm:self-auto">
            <span className="text-white text-[12px] font-black uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Compact Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 transition-all hover:shadow-md hover:border-gray-200 group"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest truncate">{card.title}</p>
              <h3 className="text-[22px] font-black text-gray-900 leading-none mt-0.5 truncate">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Section */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden mt-2">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Bookings</h3>
        </div>
        
        {stats.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-black bg-white">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentBookings.map((booking, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-[13px]">{booking.customerDetails?.fullName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{booking.customerDetails?.mobile || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800 text-[13px]">{booking.carModel?.name || 'Unknown Car'}</div>
                      <div className="text-[11px] text-[#0052cc] font-bold mt-0.5">{booking.service || 'Unknown Service'}</div>
                    </td>
                    <td className="p-4 font-black text-gray-900 text-[13px]">
                      ₹{booking.finalPrice || 0}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        (booking.status || 'pending').toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        (booking.status || 'pending').toLowerCase() === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        (booking.status || 'pending').toLowerCase() === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {booking.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FaCalendarAlt className="text-gray-300" />
            </div>
            <h3 className="text-gray-500 font-bold text-sm">No recent bookings found</h3>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
