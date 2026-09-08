import React, { useState } from 'react';
import { FaTimes, FaSave, FaSpinner, FaCheckCircle, FaClock, FaCalendarCheck, FaBan, FaUserTag, FaExclamationCircle } from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    desc: 'Waiting for confirmation',
    icon: <FaClock className="text-amber-500 shrink-0" />,
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    activeClass: 'border-amber-500 bg-amber-50/50'
  },
  confirmed: {
    label: 'Confirmed',
    desc: 'Booking accepted & scheduled',
    icon: <FaCalendarCheck className="text-blue-500 shrink-0" />,
    badgeClass: 'bg-blue-100 text-[#0052cc] border-blue-200',
    activeClass: 'border-[#0052cc] bg-blue-50/50'
  },
  completed: {
    label: 'Completed',
    desc: 'Service successfully delivered',
    icon: <FaCheckCircle className="text-emerald-500 shrink-0" />,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    activeClass: 'border-emerald-500 bg-emerald-50/50'
  },
  cancelled: {
    label: 'Cancelled',
    desc: 'Booking cancelled / rejected',
    icon: <FaBan className="text-rose-500 shrink-0" />,
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    activeClass: 'border-rose-500 bg-rose-50/50'
  },
  lead: {
    label: 'Lead',
    desc: 'Customer inquiry / Step 1 lead',
    icon: <FaUserTag className="text-purple-500 shrink-0" />,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    activeClass: 'border-purple-500 bg-purple-50/50'
  }
};

const StatusUpdateModal = ({ booking, onClose, onUpdateSuccess }) => {
  const currentBookingStatus = booking?.status?.toLowerCase() || 'pending';
  const [status, setStatus] = useState(currentBookingStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!booking) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchWithAuth(`/api/admin/bookings/${booking._id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      onUpdateSuccess();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'lead'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md my-auto max-h-[92vh] flex flex-col overflow-hidden animate-fade-in border border-gray-100">
        
        {/* Header - Compact */}
        <div className="bg-gray-50/90 px-4 py-2.5 sm:px-5 sm:py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0052cc]" />
            <h2 className="text-sm sm:text-base font-bold text-gray-900">Update Booking Status</h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1 cursor-pointer"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Content Body - Scrollable if tight screen */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-2.5">
          {/* Customer / Booking Summary Pill */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500 font-medium">Booking: </span>
              <span className="font-mono font-bold text-gray-900">#{booking._id.slice(-6)}</span>
              <span className="text-gray-400 mx-1.5">•</span>
              <span className="font-bold text-gray-800">
                {booking.customerDetails?.fullName || booking.customerDetails?.mobile || 'Customer'}
              </span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
              STATUS_CONFIG[currentBookingStatus]?.badgeClass || 'bg-gray-100 text-gray-700'
            }`}>
              Current: {currentBookingStatus}
            </span>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-start gap-2">
              <FaExclamationCircle className="shrink-0 text-red-500 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {/* Status Radio Choices - Compact List */}
          <div className="space-y-1.5">
            {statuses.map((s) => {
              const config = STATUS_CONFIG[s];
              const isSelected = status === s;
              return (
                <label 
                  key={s} 
                  className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? config.activeClass + ' shadow-xs' 
                      : 'border-gray-200 hover:bg-gray-50/70 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="booking-status"
                      value={s}
                      checked={isSelected}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-3.5 h-3.5 text-[#0052cc] border-gray-300 focus:ring-[#0052cc] cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      {config.icon}
                      <span className="font-bold text-gray-900 text-xs uppercase tracking-wide">
                        {config.label}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                    {config.desc}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer - Compact */}
        <div className="bg-gray-50/90 px-4 py-2.5 border-t border-gray-100 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-3.5 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || status === currentBookingStatus}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0052cc] text-white text-xs font-bold rounded-lg hover:bg-[#003380] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            {loading ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
            <span>{loading ? 'Updating...' : 'Save Status'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StatusUpdateModal;
