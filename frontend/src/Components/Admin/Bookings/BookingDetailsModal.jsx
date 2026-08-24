import React from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaCar, FaMapMarkerAlt, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaInfoCircle className="text-[#0052cc] text-lg" />
            <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-sm">
                <FaUser className="text-[#0052cc]" />
                Customer Information
              </div>
              <div className="space-y-1.5 text-[13px]">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{booking.customerDetails?.fullName}</span></p>
                <p><span className="text-gray-500">Mobile:</span> <span className="font-medium text-gray-900">{booking.customerDetails?.mobile}</span></p>
                {booking.customerDetails?.instructions && (
                  <p><span className="text-gray-500 block mb-1">Instructions:</span> <span className="font-medium text-gray-900 bg-white p-2 rounded block border border-gray-100">{booking.customerDetails.instructions}</span></p>
                )}
              </div>
            </div>

            {/* Car Info */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-sm">
                <FaCar className="text-[#0052cc]" />
                Vehicle Information
              </div>
              <div className="space-y-1.5 text-[13px]">
                <p><span className="text-gray-500">Model:</span> <span className="font-medium text-gray-900">{booking.carModel?.name}</span></p>
                <p><span className="text-gray-500">Category:</span> <span className="font-medium text-gray-900 capitalize">{booking.carModel?.category}</span></p>
                <p><span className="text-gray-500">Service:</span> <span className="font-bold text-[#0052cc]">{booking.service}</span></p>
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-sm">
                <FaCalendarAlt className="text-[#0052cc]" />
                Schedule & Location
              </div>
              <div className="space-y-1.5 text-[13px]">
                <p><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-900">{booking.date}</span></p>
                <p><span className="text-gray-500">Time:</span> <span className="font-medium text-gray-900">{booking.timeSlot}</span></p>
                <p className="flex items-start gap-1">
                  <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                  <span className="font-medium text-gray-900 leading-tight">
                    {booking.location?.address} {booking.location?.pincode ? `(${booking.location.pincode})` : ''}
                  </span>
                </p>
              </div>
            </div>

            {/* Billing */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold text-sm">
                <FaMoneyBillWave className="text-[#0052cc]" />
                Billing & Status
              </div>
              <div className="space-y-1.5 text-[13px]">
                <p className="text-base">
                  <span className="text-gray-500 text-[13px]">Final Price:</span>{' '}
                  <span className="font-black text-gray-900">₹{booking.finalPrice}</span>
                </p>
                <p>
                  <span className="text-gray-500 mr-2">Status:</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block border ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {booking.status || 'pending'}
                  </span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Created: {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
