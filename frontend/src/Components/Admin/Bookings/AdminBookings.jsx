import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaSearch, FaFilter, FaEye, FaEdit, FaSpinner, FaExclamationTriangle, 
  FaCalendarAlt, FaPhoneAlt, FaBan, FaTrashAlt, FaLock, FaCheckCircle 
} from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';
import BookingDetailsModal from './BookingDetailsModal';
import StatusUpdateModal from './StatusUpdateModal';
import ManualBookingModal from './ManualBookingModal';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null); // 'details' | 'status' | null
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualModalMode, setManualModalMode] = useState('phone'); // 'phone' | 'block'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

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

  const handleDeleteBooking = async (booking) => {
    const isBlocked = booking.status === 'blocked';
    const confirmText = isBlocked 
      ? `Are you sure you want to UNBLOCK slot (${booking.date} - ${booking.timeSlot})? It will become available on the website immediately.`
      : `Are you sure you want to delete the booking for ${booking.customerDetails?.fullName || 'this customer'}?`;

    if (!window.confirm(confirmText)) return;

    setActionLoadingId(booking._id);
    try {
      const res = await fetchWithAuth(`/api/admin/bookings/${booking._id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        showToast(isBlocked ? 'Slot unblocked successfully!' : 'Booking deleted successfully!');
        fetchBookings();
      } else {
        alert(res.message || 'Failed to delete');
      }
    } catch (err) {
      alert(err.message || 'Error occurred while deleting');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Client-side filtering and searching
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const bStatus = (booking.status || 'pending').toLowerCase();
      const matchesStatus = statusFilter === 'All' || bStatus === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      const bSource = (booking.bookingSource || 'website').toLowerCase();
      const matchesSource = 
        sourceFilter === 'All' ||
        (sourceFilter === 'Website' && bSource === 'website') ||
        (sourceFilter === 'Phone' && bSource === 'phone') ||
        (sourceFilter === 'Blocked' && (bSource === 'admin_block' || bStatus === 'blocked'));
      if (!matchesSource) return false;

      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        booking.customerDetails?.fullName?.toLowerCase().includes(searchLower) ||
        booking.customerDetails?.mobile?.includes(searchLower) ||
        booking.carModel?.name?.toLowerCase().includes(searchLower) ||
        booking.service?.toLowerCase().includes(searchLower) ||
        booking.location?.address?.toLowerCase().includes(searchLower) ||
        booking.date?.includes(searchLower) ||
        booking.timeSlot?.toLowerCase().includes(searchLower)
      );
    });
  }, [bookings, searchTerm, statusFilter, sourceFilter]);

  const getStatusBadge = (status) => {
    const s = status || 'pending';
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-[#0052cc] border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      blocked: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border inline-flex items-center gap-1 ${colors[s] || colors.pending}`}>
        {s === 'blocked' && <FaLock className="text-[10px]" />}
        {s}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <FaCheckCircle className="text-base text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Bookings Management</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage customer bookings, phone reservations, and block service slots</p>
        </div>

        {/* Action Buttons for Phone Booking and Block Slot */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setManualModalMode('phone');
              setManualModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003380] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <FaPhoneAlt className="text-xs" />
            <span>+ New Phone Booking</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setManualModalMode('block');
              setManualModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <FaBan className="text-xs" />
            <span>Block Slot / Off-Day</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-100 mb-5 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by customer, phone, car, area, date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:bg-white text-xs font-medium w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Source Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="pl-3 pr-7 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-xs font-bold text-gray-700 cursor-pointer w-full"
            >
              <option value="All">All Sources</option>
              <option value="Website">🌐 Website</option>
              <option value="Phone">📞 Phone Bookings</option>
              <option value="Blocked">🚫 Blocked Slots</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-8 pr-7 py-2 bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-xs font-bold text-gray-700 cursor-pointer w-full"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaSpinner className="animate-spin text-3xl mb-3 text-[#0052cc]" />
            <p className="font-bold text-xs">Loading bookings & slots...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-red-500">
            <FaExclamationTriangle className="text-3xl mb-3" />
            <p className="font-bold text-sm">{error}</p>
            <button 
              onClick={fetchBookings}
              className="mt-3 px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaCalendarAlt className="text-4xl mb-3 text-gray-300" />
            <p className="font-black text-base text-gray-700">No bookings or slots found</p>
            <p className="text-xs text-gray-400 mt-0.5">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500 font-extrabold">
                  <th className="p-3 pl-4">Customer / Type</th>
                  <th className="p-3">Vehicle & Service</th>
                  <th className="p-3">Date & Slot</th>
                  <th className="p-3">Price & Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => {
                  const isBlocked = booking.status === 'blocked';
                  const isPhone = booking.bookingSource === 'phone';

                  return (
                    <tr 
                      key={booking._id} 
                      className={`transition-colors ${
                        isBlocked 
                          ? 'bg-amber-50/40 hover:bg-amber-50/70' 
                          : 'hover:bg-blue-50/30'
                      }`}
                    >
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-gray-900 text-xs">
                            {booking.customerDetails?.fullName}
                          </span>
                          {isPhone && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-[#0052cc] rounded text-[9px] font-black uppercase tracking-wider">
                              📞 Phone
                            </span>
                          )}
                          {isBlocked && (
                            <span className="px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5">
                              <FaLock className="text-[8px]" /> Blocked
                            </span>
                          )}
                        </div>
                        {!isBlocked && (
                          <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                            {booking.customerDetails?.mobile}
                          </div>
                        )}
                        {booking.location?.address && (
                          <div className="text-[10px] text-gray-400 truncate max-w-xs mt-0.5">
                            📍 {booking.location.address}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-gray-800 text-xs">
                          {booking.carModel?.name || 'N/A'}
                        </div>
                        <div className={`text-[11px] font-bold mt-0.5 ${isBlocked ? 'text-amber-700' : 'text-[#0052cc]'}`}>
                          {booking.service}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1">
                          <FaCalendarAlt className="text-gray-400 text-[10px]" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="text-[11px] text-gray-600 font-semibold mt-0.5">
                          {booking.timeSlot}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-black text-gray-900 text-xs">
                          {isBlocked ? '—' : `₹${booking.finalPrice}`}
                        </div>
                        {!isBlocked && (
                          <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {booking.paymentMethod || 'Online'}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        {getStatusBadge(booking.status)}
                      </td>

                      <td className="p-3 pr-4 text-right space-x-1 whitespace-nowrap">
                        {!isBlocked && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setModalType('details');
                              }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#0052cc] hover:text-white transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <FaEye className="text-xs" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setModalType('status');
                              }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                              title="Update Status"
                            >
                              <FaEdit className="text-xs" />
                            </button>
                          </>
                        )}

                        {isBlocked ? (
                          <button
                            disabled={actionLoadingId === booking._id}
                            onClick={() => handleDeleteBooking(booking)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Unblock Slot"
                          >
                            <FaBan className="text-[10px]" />
                            <span>Unblock</span>
                          </button>
                        ) : (
                          <button
                            disabled={actionLoadingId === booking._id}
                            onClick={() => handleDeleteBooking(booking)}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Booking"
                          >
                            <FaTrashAlt className="text-[10px]" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Phone Booking / Block Slot Modal */}
      <ManualBookingModal
        isOpen={manualModalOpen}
        initialMode={manualModalMode}
        onClose={() => setManualModalOpen(false)}
        onSuccess={(msg) => {
          showToast(msg);
          fetchBookings();
        }}
      />

      {/* Booking Details Modal */}
      {modalType === 'details' && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={() => {
            setModalType(null);
            setSelectedBooking(null);
          }} 
        />
      )}

      {/* Status Update Modal */}
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
            showToast('Booking status updated!');
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};

export default AdminBookings;
