import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaPhoneAlt, FaBan, FaCalendarAlt, FaClock, 
  FaCar, FaUser, FaMapMarkerAlt, FaRupeeSign, FaInfoCircle, 
  FaCheckCircle, FaExclamationTriangle, FaLock
} from 'react-icons/fa';
import { fetchWithAuth, BASE_URL } from '../../../utils/api';

const TIME_SLOTS = [
  { id: 'Slot 1 – 08:30 AM', label: '08:30 AM' },
  { id: 'Slot 2 – 10:00 AM', label: '10:00 AM' },
  { id: 'Slot 3 – 11:30 AM', label: '11:30 AM' },
  { id: 'Slot 4 – 01:30 PM', label: '01:30 PM' },
  { id: 'Slot 5 – 03:00 PM', label: '03:00 PM' },
  { id: 'Slot 6 – 04:30 PM', label: '04:30 PM' },
];

const LUCKNOW_AREAS = [
  'Gomti Nagar',
  'Gomti Nagar Extension',
  'Sushant Golf City',
  'Vibhuti Khand',
  'Indira Nagar',
  'Mahanagar',
  'Aliganj',
  'Jankipuram / Extension'
];

const SERVICES_LIST = [
  'Doorstep Foam Wash & Vacuum',
  'Deep Interior Detailing & Sanitization',
  'Exterior Foam Wash & High-Gloss Wax',
  'Complete 360° Car Detailing Spa',
  'Ceramic Coating / Paint Protection',
  'Engine Bay & Underbody Clean',
  'Custom / Phone Request'
];

const CAR_BODY_CATEGORIES = [
  { id: 'Hatchback', label: 'Hatchback (Swift, i10, Tiago)' },
  { id: 'Sedan', label: 'Sedan (City, Verna, Dzire, Ciaz)' },
  { id: 'Compact SUV', label: 'Compact SUV (Creta, Brezza, Nexon)' },
  { id: 'Full-Size SUV', label: 'SUV / 7-Seater (Scorpio, Innova, Safari)' },
  { id: 'Luxury', label: 'Luxury (BMW, Audi, Mercedes, Fortuner)' }
];

const BLOCK_REASONS = [
  'Staff On Leave / Team Shortage',
  'Heavy Rain / Bad Weather',
  'Equipment & Machinery Maintenance',
  'Offline / Corporate VIP Booking',
  'Public Holiday / Center Closed'
];

const ManualBookingModal = ({ isOpen, onClose, onSuccess, initialMode = 'phone' }) => {
  const [activeTab, setActiveTab] = useState(initialMode === 'block' ? 'block' : 'phone');

  // Today formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Common fields
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0].id);

  // Phone Booking fields
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [carName, setCarName] = useState('');
  const [carCategory, setCarCategory] = useState('Sedan');
  const [service, setService] = useState(SERVICES_LIST[0]);
  const [area, setArea] = useState(LUCKNOW_AREAS[0]);
  const [specificAddress, setSpecificAddress] = useState('');
  const [finalPrice, setFinalPrice] = useState('799');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  // Block Slot fields
  const [blockReason, setBlockReason] = useState(BLOCK_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [blockAllDay, setBlockAllDay] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSlotsOnDate, setBookedSlotsOnDate] = useState([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Fetch booked slots whenever date changes to show live availability
  useEffect(() => {
    if (!date) return;
    let isCurrent = true;
    setCheckingSlots(true);

    fetch(`${BASE_URL}/api/booking/booked-slots?date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (isCurrent && data.success) {
          setBookedSlotsOnDate(data.bookedSlots || []);
        }
      })
      .catch(err => console.error('Error checking slots:', err))
      .finally(() => {
        if (isCurrent) setCheckingSlots(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [date]);

  if (!isOpen) return null;

  const isSlotTaken = (slot) => {
    if (!bookedSlotsOnDate || bookedSlotsOnDate.length === 0) return false;
    return bookedSlotsOnDate.some(b => {
      if (!b) return false;
      const bLower = String(b).toLowerCase();
      return bLower.includes(slot.label.toLowerCase()) || bLower.includes(slot.id.toLowerCase());
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'phone') {
        if (!customerName.trim()) throw new Error('Please enter customer full name.');
        if (!mobile.trim() || mobile.length < 10) throw new Error('Please enter a valid 10-digit mobile number.');
        if (!date) throw new Error('Please select a booking date.');
        if (!timeSlot) throw new Error('Please select a time slot.');

        const fullAddress = specificAddress.trim() 
          ? `${area}, ${specificAddress.trim()}`
          : `${area}, Lucknow`;

        const payload = {
          type: 'phone_booking',
          customerName: customerName.trim(),
          mobile: mobile.trim(),
          carName: carName.trim() || `${carCategory} Vehicle`,
          carCategory,
          service,
          address: fullAddress,
          city: 'Lucknow',
          date,
          timeSlot,
          finalPrice: Number(finalPrice) || 0,
          paymentMethod,
          notes: notes.trim() ? `[Phone Booking] ${notes.trim()}` : 'Booked via Company Phone Call'
        };

        const response = await fetchWithAuth('/api/admin/bookings/manual', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to create booking');
        }

        onSuccess(response.message || 'Booking created successfully!');
        onClose();
      } else {
        // Block Slot
        if (!date) throw new Error('Please select a date.');
        const finalReasonText = customReason.trim() ? customReason.trim() : blockReason;

        const payload = {
          type: 'block_slot',
          date,
          timeSlot: blockAllDay ? 'ALL_DAY' : timeSlot,
          reason: finalReasonText,
          address: `Blocked in ${area}`
        };

        const response = await fetchWithAuth('/api/admin/bookings/manual', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to block slot');
        }

        onSuccess(response.message || 'Slot(s) blocked successfully!');
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto font-sans animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-6 border border-gray-100 flex flex-col max-h-[92vh]">
        
        {/* Header with Mode Switcher */}
        <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm ${activeTab === 'phone' ? 'bg-[#0052cc]' : 'bg-amber-600'}`}>
              {activeTab === 'phone' ? <FaPhoneAlt /> : <FaBan />}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                {activeTab === 'phone' ? 'Manual Phone Booking' : 'Block Slot / Maintenance'}
              </h2>
              <p className="text-[12px] text-gray-500 font-medium">
                {activeTab === 'phone' 
                  ? 'Offline or phone-order customer slot reservation' 
                  : 'Temporarily disable slots on the website'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="px-6 pt-4 pb-2 bg-white flex gap-2 border-b border-gray-100">
          <button
            type="button"
            onClick={() => { setActiveTab('phone'); setError(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-blue-50 text-[#0052cc] border-2 border-[#0052cc]/30 shadow-xs'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FaPhoneAlt className="text-xs" />
            <span>Customer Phone Booking</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('block'); setError(null); }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'block'
                ? 'bg-amber-50 text-amber-700 border-2 border-amber-500/30 shadow-xs'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FaBan className="text-xs" />
            <span>Block Slot / Off-Day</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-4 flex-1 custom-scrollbar">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
              <FaExclamationTriangle className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Date & Slot Section (Common for both) */}
          <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/40 p-4 rounded-2xl border border-blue-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                <FaCalendarAlt className="text-[#0052cc]" /> 1. Select Date & Slot
              </span>
              {checkingSlots && (
                <span className="text-[10px] text-[#0052cc] font-bold animate-pulse">Checking slot availability...</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Booking Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0052cc]"
                />
              </div>

              {activeTab === 'block' && (
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-800 cursor-pointer select-none bg-white px-3 py-2.5 border border-amber-200 rounded-xl w-full">
                    <input
                      type="checkbox"
                      checked={blockAllDay}
                      onChange={(e) => setBlockAllDay(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Block ENTIRE Day (All 6 Slots)</span>
                  </label>
                </div>
              )}
            </div>

            {!blockAllDay && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                  <span>Available Time Slots ({bookedSlotsOnDate.length} booked)</span>
                  <span className="text-[10px] font-medium text-gray-500">Red = Already booked/blocked</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const taken = isSlotTaken(slot);
                    const isSelected = timeSlot === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTimeSlot(slot.id)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center cursor-pointer ${
                          taken
                            ? 'bg-red-50 text-red-700 border-red-200 hover:border-red-300'
                            : isSelected
                            ? activeTab === 'phone'
                              ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm'
                              : 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white text-gray-800 border-gray-200 hover:border-[#0052cc]/40'
                        }`}
                      >
                        <span className={taken ? 'line-through' : ''}>{slot.label}</span>
                        <span className={`text-[9px] font-extrabold tracking-wider uppercase mt-0.5 ${
                          taken 
                            ? 'text-red-600' 
                            : isSelected 
                            ? 'text-white/90' 
                            : 'text-emerald-600'
                        }`}>
                          {taken ? 'Occupied' : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: PHONE BOOKING DETAILS */}
          {activeTab === 'phone' && (
            <div className="space-y-3.5">
              <div className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-1">
                <FaUser className="text-[#0052cc]" /> 2. Customer & Vehicle Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0052cc]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Customer Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Vehicle Model Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Honda City / Hyundai Creta"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0052cc]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Car Body Category
                  </label>
                  <select
                    value={carCategory}
                    onChange={(e) => setCarCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0052cc] cursor-pointer"
                  >
                    {CAR_BODY_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5 border-b border-gray-100 pb-1 pt-1">
                <FaMapMarkerAlt className="text-[#0052cc]" /> 3. Service & Location
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Service Package
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0052cc] cursor-pointer"
                >
                  {SERVICES_LIST.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Lucknow Service Area
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0052cc] cursor-pointer"
                  >
                    {LUCKNOW_AREAS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    House / Plot / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Green Apartments"
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0052cc]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Price Agreed (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      className="w-full bg-white border border-gray-200 pl-7 pr-3 py-2 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#0052cc]"
                      placeholder="Amount in Rupees"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-[#0052cc] cursor-pointer"
                  >
                    <option value="Cash">Cash on Service (Recommended)</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Online">Online Advance Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Call Notes / Special Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Customer wants technician to call before arrival at main gate"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0052cc]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: BLOCK SLOT DETAILS */}
          {activeTab === 'block' && (
            <div className="space-y-4">
              <div className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5 border-b border-amber-100 pb-1">
                <FaLock className="text-amber-600" /> 2. Reason for Blocking Slot
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
                <FaInfoCircle className="text-amber-600 shrink-0 text-base mt-0.5" />
                <p className="leading-relaxed">
                  Jab aap slot block karenge, toh website par us slot ke upar line khich jayegi aur <strong>"Not Available"</strong> dikhega. Koi bhi customer online use book nahi kar payega.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                  Choose Common Reason
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {BLOCK_REASONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setBlockReason(r); setCustomReason(''); }}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        blockReason === r && !customReason
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Or Custom Reason / Remark
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP Booking offline or festival rush"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Applicable Area (Optional)
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-amber-600 cursor-pointer"
                >
                  <option value="All Lucknow Centers">All Lucknow Centers</option>
                  {LUCKNOW_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Footer Submit Button */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 rounded-xl text-xs font-black text-white shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-[#0052cc] hover:bg-[#003380] shadow-blue-500/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : activeTab === 'phone' ? (
                <>
                  <FaCheckCircle />
                  <span>Confirm Phone Booking</span>
                </>
              ) : (
                <>
                  <FaBan />
                  <span>Block Slot(s) Now</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ManualBookingModal;
