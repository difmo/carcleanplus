import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaSpinner, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';
import BookingDetailsModal from './BookingDetailsModal';
import StatusUpdateModal from './StatusUpdateModal';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details' | 'status' | null

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/api/admin/bookings');
      setBookings(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Client-side filtering and searching
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bStatus = (booking.status || 'pending').toLowerCase();
      const matchesStatus = statusFilter === 'All' || bStatus === statusFilter.toLowerCase();
      
      if (!matchesStatus) return false;

      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        booking.customerDetails?.fullName?.toLowerCase().includes(searchLower) ||
        booking.customerDetails?.mobile?.includes(searchLower) ||
        booking.carModel?.name?.toLowerCase().includes(searchLower) ||
        booking.service?.toLowerCase().includes(searchLower) ||
        booking.location?.address?.toLowerCase().includes(searchLower)
      );
    });
  }, [bookings, searchTerm, statusFilter]);

  const getStatusBadge = (status) => {
    const s = status || 'pending';
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${colors[s] || colors.pending}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all customer service requests</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent text-sm w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent text-sm appearance-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaSpinner className="animate-spin text-4xl mb-4 text-[#0052cc]" />
            <p className="font-medium">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-red-500">
            <FaExclamationTriangle className="text-4xl mb-4" />
            <p className="font-bold text-lg">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaCalendarAlt className="text-5xl mb-4 text-gray-300" />
            <p className="font-bold text-lg text-gray-600">No bookings found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-3 pl-4">Customer</th>
                  <th className="p-3">Vehicle & Service</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="font-bold text-gray-900 text-[13px]">{booking.customerDetails?.fullName}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{booking.customerDetails?.mobile}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-800 text-[13px]">{booking.carModel?.name}</div>
                      <div className="text-[11px] text-[#0052cc] font-bold mt-0.5">{booking.service}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-gray-900 text-[13px]">{booking.date}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{booking.timeSlot}</div>
                    </td>
                    <td className="p-3 font-black text-gray-900 text-[13px]">
                      ₹{booking.finalPrice}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="p-3 pr-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setModalType('details');
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#0052cc] hover:text-white transition-colors tooltip-trigger"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setModalType('status');
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-green-500 hover:text-white transition-colors tooltip-trigger"
                        title="Update Status"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalType === 'details' && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => {
            setModalType(null);
            setSelectedBooking(null);
          }} 
        />
      )}

      {modalType === 'status' && (
        <StatusUpdateModal 
          booking={selectedBooking} 
          onClose={() => {
            setModalType(null);
            setSelectedBooking(null);
          }}
          onUpdateSuccess={() => {
            setModalType(null);
            setSelectedBooking(null);
            fetchBookings(); // Refresh list to get new status
          }}
        />
      )}
    </div>
  );
};

export default AdminBookings;
