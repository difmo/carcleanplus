import React, { useState } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';

const StatusUpdateModal = ({ booking, onClose, onUpdateSuccess }) => {
  const [status, setStatus] = useState(booking?.status || 'pending');
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Update Status</h2>
          <button 
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Update the status for booking <span className="font-bold text-gray-900">#{booking._id.slice(-6)}</span> 
            ({booking.customerDetails?.fullName}).
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {statuses.map((s) => (
              <label 
                key={s} 
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  status === s 
                    ? 'border-[#0052cc] bg-blue-50/50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-4 h-4 text-[#0052cc] border-gray-300 focus:ring-[#0052cc]"
                />
                <span className="ml-3 font-bold text-gray-700 uppercase text-sm tracking-wide">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || status === booking.status}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0052cc] text-white font-bold rounded-xl hover:bg-[#0043a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {loading ? 'Saving...' : 'Save Status'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StatusUpdateModal;
