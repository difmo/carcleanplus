import React, { useState, useMemo, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CAR_MODELS, SERVICES, CAR_CATEGORIES, getPrice } from '../../utils/pricingLogic';
import { FaTimes, FaSearch, FaCar, FaCheckCircle, FaMapMarkerAlt, FaArrowLeft, FaChevronRight, FaCalendarAlt, FaClock, FaWhatsapp, FaUser, FaQuestionCircle } from 'react-icons/fa';
import { BASE_URL } from '../../utils/api';
import CarVisualIcon, { getCarBodyType, getCarBodyLabel } from './CarVisualIcon';
import {
  SiSuzuki,
  SiHyundai,
  SiTata,
  SiHonda,
  SiToyota,
  SiVolkswagen,
  SiSkoda,
  SiKia,
  SiRenault,
  SiNissan,
  SiFord,
  SiJeep,
  SiAudi,
  SiBmw,
  SiFiat,
  SiChevrolet,
  SiMercedes,
  SiVolvo,
  SiMg,
  SiMahindra,
  SiCitroen,
  SiJaguar,
  SiLandrover,
  SiPorsche,
  SiMini,
  SiMaserati,
  SiBentley,
  SiRollsroyce,
  SiAstonmartin,
  SiLamborghini,
  SiFerrari
} from 'react-icons/si';

const getCarIcon = (brandOrKey) => {
  if (!brandOrKey) return <FaCar className="text-gray-700" />;
  const name = (typeof brandOrKey === 'string' ? brandOrKey : brandOrKey.name || '').toLowerCase();
  
  if (name.includes('suzuki') || name.includes('maruti')) return <SiSuzuki className="text-[#002f6c]" />;
  if (name.includes('hyundai')) return <SiHyundai className="text-[#002c5f]" />;
  if (name.includes('tata')) return <SiTata className="text-[#004f9e]" />;
  if (name.includes('honda')) return <SiHonda className="text-[#cc0000]" />;
  if (name.includes('mahindra')) return <SiMahindra className="text-[#c3002f]" />;
  if (name.includes('kia')) return <SiKia className="text-[#05141f]" />;
  if (name.includes('toyota')) return <SiToyota className="text-[#d71921]" />;
  if (name.includes('volkswagen')) return <SiVolkswagen className="text-[#001e50]" />;
  if (name.includes('ford')) return <SiFord className="text-[#002c6c]" />;
  if (name.includes('skoda')) return <SiSkoda className="text-[#0e3b2e]" />;
  if (name.includes('mg')) return <SiMg className="text-[#b31412]" />;
  if (name.includes('renault')) return <SiRenault className="text-[#1b1b1b]" />;
  if (name.includes('bmw')) return <SiBmw className="text-[#0066b1]" />;
  if (name.includes('nissan')) return <SiNissan className="text-[#c3002f]" />;
  if (name.includes('mercedes')) return <SiMercedes className="text-[#24272a]" />;
  if (name.includes('audi')) return <SiAudi className="text-[#111827]" />;
  if (name.includes('jeep')) return <SiJeep className="text-[#1f2937]" />;
  if (name.includes('volvo')) return <SiVolvo className="text-[#003057]" />;
  if (name.includes('citroën') || name.includes('citroen')) return <SiCitroen className="text-[#990000]" />;
  if (name.includes('jaguar')) return <SiJaguar className="text-[#111827]" />;
  if (name.includes('land rover') || name.includes('range rover') || name.includes('land') || name.includes('range')) return <SiLandrover className="text-[#0c4323]" />;
  if (name.includes('porsche')) return <SiPorsche className="text-[#8b0000]" />;
  if (name.includes('mini')) return <SiMini className="text-[#111827]" />;
  if (name.includes('fiat')) return <SiFiat className="text-[#a51c30]" />;
  if (name.includes('chevrolet')) return <SiChevrolet className="text-[#cba052]" />;
  if (name.includes('maserati')) return <SiMaserati className="text-[#0c2340]" />;
  if (name.includes('bentley')) return <SiBentley className="text-[#002b49]" />;
  if (name.includes('rolls-royce') || name.includes('rolls royce')) return <SiRollsroyce className="text-[#111827]" />;
  if (name.includes('aston martin') || name.includes('aston')) return <SiAstonmartin className="text-[#004225]" />;
  if (name.includes('lamborghini')) return <SiLamborghini className="text-[#d6a127]" />;
  if (name.includes('ferrari')) return <SiFerrari className="text-[#e32119]" />;
  if (name.includes('lexus')) return <span className="font-serif font-black text-xl text-gray-800">L</span>;
  if (name.includes('datsun')) return <span className="font-bold text-[11px] px-1 border border-gray-700 rounded text-gray-800">DATSUN</span>;
  
  return <FaCar className="text-gray-700" />;
};

// Popular Vehicles exactly ordered as in screenshot Image 1
const POPULAR_BRANDS = [
  { key: 'Maruti', name: 'Maruti Suzuki', color: '#002f6c' },
  { key: 'Hyundai', name: 'Hyundai', color: '#002c5f' },
  { key: 'Tata', name: 'Tata', color: '#004f9e' },
  { key: 'Honda', name: 'Honda', color: '#cc0000' },
  { key: 'Mahindra', name: 'Mahindra', color: '#c3002f' },
  { key: 'Kia', name: 'Kia', color: '#05141f' },
];

// All Brands ordered exactly as in screenshot Image 1, followed by remaining catalog
const ALL_OTHER_BRANDS = [
  // 1 to 9 exactly matching user image:
  { key: 'Toyota', name: 'Toyota', color: '#d71921' },
  { key: 'Volkswagen', name: 'Volkswagen', color: '#001e50' },
  { key: 'Ford', name: 'Ford', color: '#002c6c' },
  { key: 'Skoda', name: 'Skoda', color: '#0e3b2e' },
  { key: 'MG', name: 'MG', color: '#b31412' },
  { key: 'Renault', name: 'Renault', color: '#1b1b1b' },
  { key: 'BMW', name: 'BMW', color: '#0066b1' },
  { key: 'Nissan', name: 'Nissan', color: '#c3002f' },
  { key: 'Mercedes-Benz', name: 'Mercedes-Benz', color: '#24272a' },

  // Remaining catalog brands:
  { key: 'Audi', name: 'Audi', color: '#111827' },
  { key: 'Jeep', name: 'Jeep', color: '#1f2937' },
  { key: 'Volvo', name: 'Volvo', color: '#003057' },
  { key: 'Citroën', name: 'Citroën', color: '#990000' },
  { key: 'Jaguar', name: 'Jaguar', color: '#111827' },
  { key: 'Land Rover', name: 'Land Rover', color: '#0c4323' },
  { key: 'Lexus', name: 'Lexus', color: '#111827' },
  { key: 'Porsche', name: 'Porsche', color: '#8b0000' },
  { key: 'MINI', name: 'MINI', color: '#111827' },
  { key: 'Fiat', name: 'Fiat', color: '#a51c30' },
  { key: 'Chevrolet', name: 'Chevrolet', color: '#cba052' },
  { key: 'Datsun', name: 'Datsun', color: '#003399' },
  { key: 'Maserati', name: 'Maserati', color: '#0c2340' },
  { key: 'Bentley', name: 'Bentley', color: '#002b49' },
  { key: 'Rolls-Royce', name: 'Rolls-Royce', color: '#111827' },
  { key: 'Aston Martin', name: 'Aston Martin', color: '#004225' },
  { key: 'Lamborghini', name: 'Lamborghini', color: '#d6a127' },
  { key: 'Ferrari', name: 'Ferrari', color: '#e32119' },
];

const getModelDisplayName = (carName) => {
  return carName.replace(
    /^(Maruti Suzuki|Maruti|Hyundai|Tata|Honda|Mahindra|Kia|Toyota|Volkswagen|Ford|Skoda|MG|Renault|BMW|Nissan|Mercedes-Benz|Audi|Jeep|Volvo|Citroën|Jaguar|Land Rover|Range Rover|Lexus|Porsche|MINI|Maserati|Bentley|Rolls-Royce|Aston Martin|Lamborghini|Ferrari|Fiat|Chevrolet|Datsun)\s+/i,
    ''
  );
};

const TIME_SLOTS = [
  { id: 'Slot 1 – 08:30 AM', label: '08:30 AM', timeKey: '08:30', period: 'AM' },
  { id: 'Slot 2 – 10:00 AM', label: '10:00 AM', timeKey: '10:00', period: 'AM' },
  { id: 'Slot 3 – 11:30 AM', label: '11:30 AM', timeKey: '11:30', period: 'AM' },
  { id: 'Slot 4 – 01:30 PM', label: '01:30 PM', timeKey: '01:30', period: 'PM' },
  { id: 'Slot 5 – 03:00 PM', label: '03:00 PM', timeKey: '03:00', period: 'PM' },
  { id: 'Slot 6 – 04:30 PM', label: '04:30 PM', timeKey: '04:30', period: 'PM' },
];

const isSlotPastForDate = (selectedDateStr, slot) => {
  if (!selectedDateStr) return false;
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayStr = `${y}-${m}-${d}`;

  // Only check past time if selected date is today
  if (selectedDateStr !== todayStr) return false;

  const [hStr, mStr] = slot.timeKey.split(':');
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  if (slot.period === 'PM' && hours < 12) hours += 12;
  if (slot.period === 'AM' && hours === 12) hours = 0;

  const slotDate = new Date();
  slotDate.setHours(hours, minutes, 0, 0);

  return now.getTime() >= slotDate.getTime();
};

const isSlotBookedForDate = (slot, bookedList) => {
  if (!Array.isArray(bookedList) || bookedList.length === 0) return false;
  return bookedList.some(booked => {
    if (!booked) return false;
    const b = String(booked).toLowerCase();
    const idLower = slot.id.toLowerCase();
    const labelLower = slot.label.toLowerCase();
    if (b === idLower || b === labelLower) return true;
    if (slot.timeKey && b.includes(slot.timeKey)) return true;
    if (slot.timeKey && slot.timeKey.startsWith('0') && b.includes(slot.timeKey.slice(1))) return true;
    return false;
  });
};

const BookingModal = () => {
  const { bookingState, updateBooking, nextStep, prevStep, setStep, closeModal, resetBooking } = useBooking();
  const { isModalOpen, currentStep } = bookingState;

  const [searchCity, setSearchCity] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showCantFindModal, setShowCantFindModal] = useState(false);
  const [customCarName, setCustomCarName] = useState('');
  const [customCategory, setCustomCategory] = useState(CAR_CATEGORIES.STANDARD);

  // Auto-initialize today's date if user reaches step 6 without choosing a date
  useEffect(() => {
    if (currentStep === 6 && !bookingState.date) {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      updateBooking('date', `${y}-${m}-${d}`);
    }
  }, [currentStep, bookingState.date]);

  useEffect(() => {
    if (!bookingState.date) {
      setBookedSlots([]);
      return;
    }

    let isCurrent = true;
    setIsLoadingSlots(true);
    fetch(`${BASE_URL}/api/booking/booked-slots?date=${bookingState.date}`)
      .then(res => res.json())
      .then(data => {
        if (isCurrent && data.success) {
          const slots = data.bookedSlots || [];
          setBookedSlots(slots);
          if (bookingState.timeSlot) {
            const currentSlotObj = TIME_SLOTS.find(s => s.id === bookingState.timeSlot);
            if (currentSlotObj && (isSlotBookedForDate(currentSlotObj, slots) || isSlotPastForDate(bookingState.date, currentSlotObj))) {
              updateBooking('timeSlot', '');
            }
          }
        }
      })
      .catch(err => {
        console.error('Error fetching booked slots:', err);
      })
      .finally(() => {
        if (isCurrent) setIsLoadingSlots(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [bookingState.date]);

  const CITIES = [
    'Gomti Nagar',
    'Gomti Nagar Extension',
    'Sushant Golf City',
    'Vibhuti Khand',
    'Indira Nagar',
    'Mahanagar',
    'Aliganj',
    'Jankipuram / Extension'
  ];

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));

  const brandModels = useMemo(() => {
    if (!bookingState.carBrand) return [];
    const brandLower = bookingState.carBrand.toLowerCase();
    return CAR_MODELS.filter(car => {
      const carLower = car.name.toLowerCase();
      if (brandLower === 'maruti' || brandLower === 'maruti suzuki') {
        return carLower.startsWith('maruti');
      }
      if (brandLower === 'land rover' || brandLower === 'range rover' || brandLower === 'land' || brandLower === 'range') {
        return carLower.startsWith('land rover') || carLower.startsWith('range rover');
      }
      if (brandLower === 'aston martin' || brandLower === 'aston') {
        return carLower.startsWith('aston martin');
      }
      if (brandLower === 'rolls-royce' || brandLower === 'rolls royce') {
        return carLower.startsWith('rolls-royce') || carLower.startsWith('rolls royce');
      }
      return carLower.startsWith(brandLower);
    });
  }, [bookingState.carBrand]);

  const filteredModels = brandModels.filter(car => car.name.toLowerCase().includes(searchModel.toLowerCase()));

  if (!isModalOpen) return null;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentAndBooking = async () => {
    setIsSubmitting(true);
    const price = bookingState.finalPrice || 0;

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert("Failed to initiate payment");
        setIsSubmitting(false);
        return;
      }

      // 2. Load Razorpay
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsSubmitting(false);
        return;
      }

      // 3. Setup Razorpay options
      const activeRazorpayKey = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TUHd7o8zEcyLCG";
      const options = {
        key: activeRazorpayKey,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Car Clean Plus",
        description: "Payment for " + (bookingState.service || "Doorstep Car Wash"),
        order_id: orderData.data.id,
        handler: async function (response) {
          // Verify on backend
          const verifyRes = await fetch(`${BASE_URL}/api/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Save Booking
            await submitFinalBooking(response.razorpay_payment_id, response.razorpay_order_id, 'paid');
          } else {
            alert("Payment verification failed. Please contact support.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: bookingState.name?.trim() || "Customer",
          contact: bookingState.mobile
        },
        theme: {
          color: "#0052cc"
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (resp) {
        alert(resp.error?.description || "Payment failed or was cancelled.");
        setIsSubmitting(false);
      });
      paymentObject.open();

    } catch (err) {
      alert("Error initializing payment. Please try again.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleCashPayment = async () => {
    setIsSubmitting(true);
    await submitFinalBooking(null, null, 'pending', 'Cash');
  };

  const submitFinalBooking = async (paymentId, orderId, paymentStatus, paymentMethod = 'Online') => {
    try {
      const payload = {
        carModel: bookingState.carModel,
        service: bookingState.service,
        location: { address: 'To be confirmed on call', pincode: 'N/A', city: bookingState.city },
        date: bookingState.date || 'To be decided',
        timeSlot: bookingState.timeSlot || 'TBD',
        customerDetails: {
          fullName: bookingState.name?.trim() || 'Customer',
          mobile: bookingState.mobile,
          instructions: 'Call customer to confirm location and time.'
        },
        finalPrice: bookingState.finalPrice || 0,
        paymentId,
        orderId,
        paymentStatus,
        paymentMethod
      };

      const response = await fetch(`${BASE_URL}/api/booking/${bookingState.bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        // Save the last 5 characters of ID as the visual Booking ID
        const shortId = data.data._id.substring(data.data._id.length - 5).toUpperCase();
        setCreatedBookingId(shortId);
        setBookingConfirmed(true);
      } else {
        alert("Failed to submit booking: " + data.message);
      }
    } catch (err) {
      alert("Error connecting to server. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderHeaderIcon = (icon = <FaCar />, cornerIcon = <FaMapMarkerAlt />) => (
    <div className="flex justify-center mb-4 relative">
      <div className="w-16 h-16 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center relative shadow-sm border border-white">
        <div className="text-3xl text-gray-800 drop-shadow-sm">{icon}</div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-[#0052cc] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          <div className="text-white text-[9px]">{cornerIcon}</div>
        </div>
      </div>
    </div>
  );

  const renderCloseButton = () => (
    <button onClick={closeModal} className="absolute right-4 top-4 p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all z-10">
      <FaTimes className="text-sm" />
    </button>
  );

  const renderBackButton = () => (
    <button onClick={prevStep} className="absolute left-4 top-4 p-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all z-10 shadow-sm border border-gray-100">
      <FaArrowLeft className="text-sm" />
    </button>
  );

    const handleMobileSubmit = async () => {
    if (bookingState.mobile.length < 10) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/booking/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: bookingState.mobile,
          fullName: bookingState.name?.trim() || ''
        })
      });
      const data = await response.json();
      if (data.success) {
        updateBooking('bookingId', data.data._id);
        // Determine where to go next based on if car/service are pre-filled
        if (bookingState.carModel && bookingState.service) {
           updateBooking('currentStep', 6);
        } else if (bookingState.carModel) {
           updateBooking('currentStep', 5);
        } else {
           updateBooking('currentStep', 2); // Go to City
        }
      } else {
        alert("Error saving lead");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="animate-fade-in flex flex-col h-full relative">
      {renderCloseButton()}
      {renderHeaderIcon()}
      <div className="text-center mb-5">
        <h2 className="text-[24px] font-black text-gray-900 mb-1.5 tracking-tight">Let's get started</h2>
        <p className="text-gray-500 text-[13px] px-6 leading-relaxed">Enter your name and mobile number to view exact prices and available slots.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0052cc] focus-within:ring-2 focus-within:ring-[#0052cc]/10 transition-all shadow-sm">
            <div className="bg-gray-50/50 px-4 py-3 border-r border-gray-100 flex items-center text-gray-400">
              <FaUser className="text-[14px]" />
            </div>
            <input
              type="text"
              value={bookingState.name || ''}
              onChange={(e) => updateBooking('name', e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 font-bold placeholder-gray-300 text-[15px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0052cc] focus-within:ring-2 focus-within:ring-[#0052cc]/10 transition-all shadow-sm">
            <div className="bg-gray-50/50 px-4 py-3 border-r border-gray-100 flex items-center font-black text-gray-900 text-[14px]">
              +91
            </div>
            <input
              type="tel"
              maxLength="10"
              value={bookingState.mobile}
              onChange={(e) => updateBooking('mobile', e.target.value.replace(/\D/g, ''))}
              placeholder="Phone number"
              className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 font-bold placeholder-gray-300 disabled:opacity-50 text-[15px] tracking-wide"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button 
          onClick={handleMobileSubmit}
          disabled={bookingState.mobile.length < 10 || !bookingState.name?.trim() || isSubmitting}
          className={`w-full font-extrabold py-3.5 rounded-xl text-[15px] transition-all shadow-md ${
            bookingState.mobile.length >= 10 && bookingState.name?.trim() && !isSubmitting ? 'bg-[#0052cc] text-white hover:bg-[#003380] hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in flex flex-col h-full relative">
      {renderCloseButton()}
      {renderHeaderIcon()}
      <div className="text-center mb-5">
        <h2 className="text-[24px] font-black text-gray-900 mb-1.5 tracking-tight">Set up your booking</h2>
        <p className="text-gray-500 text-[13px] px-6 leading-relaxed">Add your location and car to see exact prices, offers and available slots.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[160px]">
        <div className="p-4 flex items-center gap-3 border-b border-gray-50 bg-gray-50/50">
          <FaMapMarkerAlt className="text-gray-800 text-base" />
          <span className="font-extrabold text-gray-900 text-base">Select Area (Lucknow)</span>
        </div>
        <div className="p-3 bg-white border-b border-gray-50 sticky top-0 z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search area..."
              className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-9 pr-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto custom-scrollbar bg-white p-2">
          {filteredCities.map(city => (
            <div
              key={city}
              onClick={() => {
                updateBooking('city', city);
                nextStep();
              }}
              className="px-4 py-3 mx-1 my-1 rounded-xl text-gray-700 text-[14px] font-bold hover:bg-blue-50/70 hover:text-[#0052cc] cursor-pointer transition-all flex justify-between items-center group border border-gray-100 hover:border-blue-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] flex items-center justify-center text-sm group-hover:bg-[#0052cc] group-hover:text-white transition-colors shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="text-gray-900 font-extrabold text-[14px] block group-hover:text-[#0052cc] transition-colors">{city}</span>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Doorstep Service Available
                  </span>
                </div>
              </div>
              <FaChevronRight className="text-[#0052cc] opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
            </div>
          ))}
          {filteredCities.length === 0 && <div className="p-4 text-center text-[14px] text-gray-400 font-medium">No area found matching "{searchCity}"</div>}
        </div>
      </div>

      <div className="mt-4 pt-1 pb-1">
        <button disabled className="w-full bg-gray-100 text-gray-400 font-extrabold py-3 rounded-xl text-[15px] cursor-not-allowed">Continue</button>
      </div>
    </div>
  );

  const renderCantFindModal = () => (
    <div className="absolute inset-0 bg-white z-20 flex flex-col p-5 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <h3 className="font-bold text-gray-900 text-[16px] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]"></span>
          Can't find your Vehicle?
        </h3>
        <button
          onClick={() => setShowCantFindModal(false)}
          className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <p className="text-[12px] text-gray-500 leading-relaxed">
          Type your car make and model name below. We'll automatically determine the right service package for you.
        </p>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Car Make & Model Name
          </label>
          <input
            type="text"
            placeholder="e.g. Nissan Magnite, Mahindra Thar Roxx..."
            value={customCarName}
            onChange={e => setCustomCarName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Select Car Segment / Body Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: CAR_CATEGORIES.COMPACT, label: 'Hatchback', sub: 'Compact' },
              { id: CAR_CATEGORIES.STANDARD, label: 'Sedan/CUV', sub: 'Standard' },
              { id: CAR_CATEGORIES.LARGE, label: 'SUV/MUV', sub: 'Large' },
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setCustomCategory(type.id)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  customCategory === type.id
                    ? 'border-[#0052cc] bg-blue-50/70 text-[#0052cc] font-bold shadow-sm'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-medium'
                }`}
              >
                <div className="text-xs">{type.label}</div>
                <div className="text-[10px] text-gray-400 uppercase">{type.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <FaQuestionCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
          <span>Need help? Choose your best estimate or chat with our team directly.</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setShowCantFindModal(false)}
          className="w-1/3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50"
        >
          Back
        </button>
        <button
          disabled={!customCarName.trim()}
          onClick={() => {
            const trimmed = customCarName.trim();
            const brandGuess = trimmed.split(' ')[0];
            updateBooking('carBrand', brandGuess);
            updateBooking('carModel', {
              id: Date.now(),
              name: trimmed,
              category: customCategory,
            });
            setShowCantFindModal(false);
            updateBooking('currentStep', 5);
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
            customCarName.trim()
              ? 'bg-[#0052cc] text-white hover:bg-[#003380]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => {
    const isSearching = searchBrand.trim().length > 0;
    const query = searchBrand.trim().toLowerCase();

    const matchesBrand = (brand) => {
      if (!isSearching) return true;
      if (brand.name.toLowerCase().includes(query) || brand.key.toLowerCase().includes(query)) return true;
      return CAR_MODELS.some(car => {
        const cLower = car.name.toLowerCase();
        if (!cLower.includes(query)) return false;
        if (brand.key === 'Maruti') return cLower.startsWith('maruti');
        if (brand.key === 'Land Rover') return cLower.startsWith('land') || cLower.startsWith('range');
        if (brand.key === 'Aston Martin') return cLower.startsWith('aston');
        return cLower.startsWith(brand.key.toLowerCase());
      });
    };

    const matchingPopular = POPULAR_BRANDS.filter(matchesBrand);
    const matchingAll = ALL_OTHER_BRANDS.filter(matchesBrand);

    const directMatchingCars = isSearching
      ? CAR_MODELS.filter(car => car.name.toLowerCase().includes(query)).slice(0, 6)
      : [];

    return (
      <div className="animate-fade-in relative flex flex-col h-full">
        {/* Top bar matching Image 1 */}
        <div className="flex items-center justify-between pb-3 pt-1 border-b border-gray-100 mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={prevStep}
              className="p-2 -ml-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              title="Back"
            >
              <FaArrowLeft className="text-sm" />
            </button>
            <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">
              Select Vehicle
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCantFindModal(true)}
              className="bg-[#facc15] hover:bg-[#eab308] text-gray-950 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              Can't find your Vehicle?
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
              title="Close"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>

        {/* Search bar matching Image 1 */}
        <div className="relative mb-3 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <FaSearch className="text-amber-500 text-sm" />
          </div>
          <input
            type="text"
            placeholder='Search "Audi A4"'
            className="w-full bg-white border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 pl-10 pr-8 py-2.5 rounded-xl text-[14px] font-medium text-gray-900 placeholder-gray-400 outline-none transition-all shadow-sm"
            value={searchBrand}
            onChange={e => setSearchBrand(e.target.value)}
          />
          {searchBrand && (
            <button
              onClick={() => setSearchBrand('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>

        {/* Brands Container with Popular & All Brands */}
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-1 pb-2 space-y-4">
          {/* Direct Matching Cars if searching */}
          {isSearching && directMatchingCars.length > 0 && (
            <div>
              <h3 className="text-[13px] font-bold text-gray-700 mb-2 px-1">
                Direct Car Matches
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {directMatchingCars.map(car => (
                  <div
                    key={car.id}
                    onClick={() => {
                      updateBooking('carBrand', car.name.split(' ')[0]);
                      updateBooking('carModel', car);
                      updateBooking('currentStep', 5);
                    }}
                    className="p-2.5 bg-blue-50/50 hover:bg-blue-100/70 border border-blue-200/60 rounded-xl cursor-pointer transition-all flex items-center gap-2"
                  >
                    <div className="text-lg">{getCarIcon(car.name.split(' ')[0])}</div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-gray-900 truncate">{car.name}</div>
                      <div className="text-[10px] text-gray-500 font-medium">{car.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 1: Popular Vehicles */}
          {matchingPopular.length > 0 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2.5 px-1">
                Popular Vehicles
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {matchingPopular.map(brand => (
                  <div
                    key={brand.name}
                    onClick={() => {
                      updateBooking('carBrand', brand.name);
                      nextStep();
                    }}
                    className="flex flex-col items-center justify-center py-3.5 px-1.5 rounded-2xl bg-white hover:bg-gray-50/90 border border-gray-100/80 hover:border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all aspect-[4/3] group"
                  >
                    <div className="text-[34px] flex items-center justify-center h-10 transition-transform duration-200 group-hover:scale-110">
                      {getCarIcon(brand.name)}
                    </div>
                    <span className="text-[12px] font-medium text-gray-800 text-center tracking-tight mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: All Brands */}
          {matchingAll.length > 0 && (
            <div>
              <h3 className="text-[15px] font-bold text-gray-900 mb-2.5 px-1">
                All Brands
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {matchingAll.map(brand => (
                  <div
                    key={brand.name}
                    onClick={() => {
                      updateBooking('carBrand', brand.name);
                      nextStep();
                    }}
                    className="flex flex-col items-center justify-center py-3.5 px-1.5 rounded-2xl bg-white hover:bg-gray-50/90 border border-gray-100/80 hover:border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all aspect-[4/3] group"
                  >
                    <div className="text-[34px] flex items-center justify-center h-10 transition-transform duration-200 group-hover:scale-110">
                      {getCarIcon(brand.name)}
                    </div>
                    <span className="text-[12px] font-medium text-gray-800 text-center tracking-tight mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No search results */}
          {matchingPopular.length === 0 && matchingAll.length === 0 && directMatchingCars.length === 0 && (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                <FaCar />
              </div>
              <p className="text-[14px] font-bold text-gray-800 mb-1">
                No vehicle found matching "{searchBrand}"
              </p>
              <p className="text-[12px] text-gray-500 mb-4">
                Don't worry! You can type your car name manually to continue booking.
              </p>
              <button
                onClick={() => {
                  setCustomCarName(searchBrand);
                  setShowCantFindModal(true);
                }}
                className="bg-[#facc15] hover:bg-[#eab308] text-gray-950 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
              >
                Enter "{searchBrand}" manually
              </button>
            </div>
          )}
        </div>

        {/* Can't find vehicle drawer */}
        {showCantFindModal && renderCantFindModal()}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="animate-fade-in relative flex flex-col h-full bg-gray-50/50 rounded-3xl p-5">
      {renderBackButton()}

      {renderHeaderIcon(getCarIcon(bookingState.carBrand))}
      <div className="text-center mb-5">
        <h2 className="text-[22px] font-black text-gray-900 mb-1.5 tracking-tight">Select {bookingState.carBrand} Model</h2>
        <p className="text-gray-500 text-[13px] px-6 leading-relaxed">Choose your car details to see exact prices and available slots.</p>
      </div>

      <div className="relative mb-4 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
        </div>
        <input
          type="text"
          placeholder={`Search ${bookingState.carBrand} models...`}
          className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-9 pr-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300"
          value={searchModel}
          onChange={e => setSearchModel(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar flex-1 pt-1 pb-4 content-start min-h-[160px] px-1">
        {filteredModels.map(car => {
          const bodyType = getCarBodyType(car.name);
          const bodyLabel = getCarBodyLabel(bodyType);
          return (
            <div
              key={car.id}
              onClick={() => {
                updateBooking('carModel', car);
                nextStep();
              }}
              className="flex flex-col items-center justify-between p-3.5 rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#0052cc] hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all aspect-[4/3] group relative overflow-hidden"
            >
              <div className="w-full flex items-center justify-center pt-1 transition-transform duration-200 group-hover:scale-110">
                <CarVisualIcon carName={car.name} className="w-[88px] h-[42px] drop-shadow-sm" />
              </div>
              <div className="text-center mt-1 w-full">
                <h4 className="font-extrabold text-gray-900 text-[13px] truncate group-hover:text-[#0052cc] transition-colors">
                  {getModelDisplayName(car.name)}
                </h4>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-[#0052cc] font-extrabold px-1.5 py-0.5 bg-blue-50 rounded-md">
                    {bodyLabel}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold truncate">
                    {car.category}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredModels.length === 0 && <div className="col-span-2 text-center py-6 text-gray-400 text-[14px] font-medium">No models found</div>}
      </div>
    </div>
  );

  const renderStep5 = () => {
    const category = bookingState.carModel?.category || 'STANDARD';
    const packages = [
      { 
        id: SERVICES.BASIC, 
        title: 'Basic Wash', 
        desc: 'Basic = Outside',
        time: '30 - 40 mins',
        rating: '4.7', 
        features: ['Exterior Wash', 'Wheel Cleaning', 'Tyre Shine', 'Drying'] 
      },
      { 
        id: SERVICES.PREMIUM, 
        title: 'Premium Wash', 
        desc: 'Premium = Outside + Inside',
        time: '45 - 60 mins',
        rating: '4.9', 
        popular: true,
        features: ['Everything in Basic Plus', 'Interior Vacuum', 'Dashboard Cleaning', 'Mat Cleaning', 'Tyre & Rim Shine'] 
      },
      { 
        id: SERVICES.COMPLETE, 
        title: 'Complete Clean', 
        desc: 'Complete = Full Deep Clean',
        time: '60 - 90 mins',
        rating: '4.8', 
        features: ['Everything in Premium', 'Deep Interior Cleaning', 'Seat & Mat Cleaning', 'Interior Detailing', 'Air Freshener'] 
      }
    ];

    return (
      <div className="animate-fade-in relative flex flex-col h-full bg-gray-50/50 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-2 pt-1">
          <button onClick={prevStep} className="p-2 bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-sm border border-gray-100 transition-all"><FaArrowLeft className="text-sm" /></button>
          <h2 className="text-[20px] font-black text-gray-900 tracking-tight">Choose a Package</h2>
        </div>
        <p className="text-gray-500 text-[11px] font-semibold mb-3 px-1 tracking-wide">All Packages include doorstep service & premium products</p>

        <div className="space-y-2.5 overflow-y-auto custom-scrollbar flex-1 pb-2 pr-1 px-1">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => updateBooking('service', pkg.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 shadow-sm ${bookingState.service === pkg.id ? 'bg-blue-50/50 border-[#0052cc] ring-1 ring-[#0052cc]/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}
            >
              <div className="w-[50px] h-[50px] bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 p-1">
                {bookingState.carModel ? (
                  <CarVisualIcon carName={bookingState.carModel.name} className="w-10 h-6" />
                ) : (
                  <FaCar className="text-gray-300 text-xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-gray-900 text-[13px] leading-tight truncate">{pkg.title}</h4>
                  {pkg.popular && (
                    <span className="bg-[#0052cc] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 font-semibold mb-1">{pkg.desc}</p>
                <div className="flex items-center gap-2 mt-0.5 mb-1">
                  <div className="font-black text-gray-900 text-[16px]">₹{getPrice(category, pkg.id)}</div>
                  <div className="bg-blue-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="text-[#0052cc] text-[9px]">★</span>
                    <span className="font-bold text-gray-900 text-[10px]">{pkg.rating}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">({pkg.time})</span>
                </div>
                <ul className="space-y-0.5">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="text-[10px] text-gray-600 font-semibold flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-[8px] flex-shrink-0" /> <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center pl-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${bookingState.service === pkg.id ? 'border-[#0052cc] bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  {bookingState.service === pkg.id && <div className="w-2 h-2 bg-[#0052cc] rounded-full"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-1">
          <button
            onClick={nextStep}
            disabled={!bookingState.service}
            className="w-full bg-[#0052cc] text-white font-black py-3.5 rounded-xl text-[16px] transition-all disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-600 shadow-md disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep6 = () => {
    // Get today's date in YYYY-MM-DD format for the min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="animate-fade-in relative flex flex-col h-full pt-4">
        {renderCloseButton()}
        {renderBackButton()}

        <div className="text-center w-full max-w-sm mx-auto mt-2 mb-5">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-200/50">
            <FaCalendarAlt className="text-2xl text-blue-500" />
          </div>
          <h2 className="text-[22px] font-black text-gray-900 mb-1.5 tracking-tight leading-tight uppercase">Car Clean Plus<br/>Book Your Slot</h2>
          <div className="flex justify-center mt-3 mb-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-gradient-to-r from-[#0052cc]/5 via-[#0052cc]/10 to-[#3377ff]/5 border border-[#0052cc]/20 rounded-full shadow-sm backdrop-blur-sm">
              <span className="text-[#0052cc] text-[13px]"><FaCalendarAlt /></span>
              <span className="text-[11px] font-black text-gray-800 tracking-widest uppercase mt-0.5">Monday - Saturday</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
          <div className="mb-5">
            <label className="block text-[11px] font-black text-gray-800 mb-2 uppercase tracking-widest pl-1 flex items-center gap-1.5">
              <FaCalendarAlt className="text-[#0052cc]" /> Select Date
            </label>
            <div className="relative">
              <input 
                type="date" 
                min={today}
                value={bookingState.date}
                onChange={(e) => {
                  updateBooking('date', e.target.value);
                  updateBooking('timeSlot', '');
                }}
                className="w-full bg-white border-2 border-gray-200 hover:border-[#0052cc]/40 focus:border-[#0052cc] px-4 py-3 rounded-xl text-[14px] font-bold text-gray-900 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 pl-1 pr-1">
              <label className="text-[11px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                <FaClock className="text-[#0052cc]" /> Select Slot
              </label>
              {isLoadingSlots && (
                <span className="text-[10px] font-bold text-[#0052cc] animate-pulse">Checking...</span>
              )}
            </div>

            {!bookingState.date && (
              <div className="p-2.5 mb-2 bg-blue-50/70 border border-blue-100 rounded-xl text-center text-[12px] font-bold text-[#0052cc]">
                Please choose a date above to check slots
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5">
              {TIME_SLOTS.map((slot) => {
                const isBooked = isSlotBookedForDate(slot, bookedSlots);
                const isPast = isSlotPastForDate(bookingState.date, slot);
                const isUnavailable = isBooked || isPast;
                const isSelected = bookingState.timeSlot === slot.id;

                if (isUnavailable) {
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={true}
                      className="py-3 px-2 rounded-xl text-[13px] font-bold border-2 border-red-200/80 bg-red-50/50 text-gray-400 cursor-not-allowed flex flex-col items-center justify-center opacity-85 shadow-none select-none transition-all"
                      title={isBooked ? "This slot is already booked for this date" : "This slot time has already passed for today"}
                    >
                      <span className="line-through text-gray-400 font-extrabold">{slot.label}</span>
                      <span className="text-[10px] font-black tracking-wider text-red-500 uppercase mt-0.5">
                        Not Available
                      </span>
                    </button>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!bookingState.date}
                    onClick={() => updateBooking('timeSlot', slot.id)}
                    className={`py-3 px-2 rounded-xl text-[13px] font-bold border-2 transition-all flex flex-col items-center justify-center ${
                      !bookingState.date
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#0052cc] bg-[#0052cc] text-white shadow-md'
                        : 'border-gray-100 bg-white text-gray-800 hover:border-[#0052cc]/40 hover:bg-blue-50/30'
                    }`}
                  >
                    <span className="font-extrabold">{slot.label}</span>
                    {bookingState.date && (
                      <span className={`text-[10px] font-extrabold mt-0.5 ${isSelected ? 'text-blue-100' : 'text-emerald-600'}`}>
                        Available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-2.5 ml-1">
              Slots marked as <span className="text-red-500 font-bold">Not Available</span> are already booked or past schedule.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-1 pb-1 shrink-0">
          <button
            onClick={nextStep}
            disabled={!bookingState.date || !bookingState.timeSlot}
            className="w-full bg-[#0052cc] text-white font-black py-3.5 rounded-xl text-[16px] transition-all disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-blue-600 shadow-md disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep7 = () => (
    <div className="animate-fade-in relative flex flex-col h-full pt-4">
      {renderCloseButton()}
      {renderBackButton()}

      <div className="text-center w-full max-w-sm mx-auto mt-6">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-200/50">
          <FaCar className="text-2xl text-blue-500" />
        </div>
        <h2 className="text-[26px] font-black text-gray-900 mb-2 tracking-tight leading-tight">Welcome to<br />Car Clean Plus</h2>
        <p className="text-gray-500 text-[13px] mb-8 leading-relaxed px-4 font-medium">
          Login to book top car wash and car services at your doorstep.
        </p>


      </div>

      <div className="mt-auto pt-4 pb-1 space-y-3">
        <button
          onClick={handlePaymentAndBooking}
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white font-black py-3.5 rounded-xl text-[16px] hover:bg-black transition-all disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 shadow-md disabled:shadow-none"
        >
          {isSubmitting ? 'Processing...' : `Pay Online ₹${bookingState.finalPrice || 0}`}
        </button>

        <div className="flex items-center justify-center space-x-2">
          <hr className="w-1/3 border-gray-300" />
          <span className="text-gray-500 text-[12px] font-bold">OR</span>
          <hr className="w-1/3 border-gray-300" />
        </div>

        <button
          onClick={handleCashPayment}
          disabled={isSubmitting}
          className="w-full bg-white text-gray-900 border-2 border-gray-900 font-black py-3.5 rounded-xl text-[16px] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:border-gray-200 disabled:text-gray-400 shadow-sm disabled:shadow-none"
        >
          {isSubmitting ? 'Processing...' : 'Pay with Cash'}
        </button>
      </div>
    </div>
  );

  const getWhatsAppLink = () => {
    const adminPhone = "919120759988";
    const bookingId = `CCP-${createdBookingId || Math.floor(Math.random() * 90000) + 10000}`;
    const nameLine = bookingState.name?.trim() ? `*Name:* ${bookingState.name.trim()}\n` : '';
    const message = `Hello Car Clean Plus, my booking is confirmed!\n\n*Booking ID:* ${bookingId}\n${nameLine}*Service:* ${bookingState.service}\n*Vehicle:* ${bookingState.carModel?.name}\n*City:* ${bookingState.city}\n*Mobile:* ${bookingState.mobile}\n*Amount:* ₹${bookingState.finalPrice}\n\nPlease contact me to confirm the location and time.`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  const renderSuccess = () => (
    <div className="text-center py-4 animate-fade-in flex flex-col h-full justify-center">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-[4px] border-green-100/50 shadow-sm relative">
        <FaCheckCircle className="text-4xl text-green-500 relative z-10 bg-white rounded-full" />
      </div>
      <h2 className="text-[24px] font-black text-gray-900 mb-2 tracking-tight">Booking Confirmed!</h2>
      <p className="text-gray-500 text-[13px] mb-6 px-2 leading-relaxed font-medium">Thank you for choosing Car Clean Plus. Our executive will call you shortly to confirm your exact location and preferred time.</p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-left shadow-inner">
        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest font-black">Booking ID</p>
        <p className="font-black text-[20px] text-gray-900 mb-3 tracking-tight">CCP-{createdBookingId || Math.floor(Math.random() * 90000) + 10000}</p>

        <div className="space-y-2.5 pt-3 border-t border-gray-200/60">
          {bookingState.name?.trim() && (
            <div className="flex justify-between items-center">
              <span className="text-[12px] text-gray-500 font-bold">Customer Name</span>
              <span className="text-[12px] font-black text-gray-900">{bookingState.name}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-500 font-bold">Service</span>
            <span className="text-[12px] font-black text-gray-900">{bookingState.service}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-500 font-bold">Vehicle</span>
            <span className="text-[12px] font-black text-gray-900">{bookingState.carModel?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-gray-500 font-bold">City</span>
            <span className="text-[12px] font-black text-gray-900">{bookingState.city}</span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white hover:bg-[#1ebe5d] flex items-center justify-center gap-2 font-black py-3.5 px-2 rounded-xl transition-all text-[14px] shadow-md"
        >
          <FaWhatsapp className="text-xl" />
          WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[390px] sm:max-w-[430px] max-h-[92vh] flex flex-col relative overflow-hidden transform transition-all border border-gray-100">
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col relative custom-scrollbar">
          {!bookingConfirmed && currentStep === 1 && renderStep1()}
          {!bookingConfirmed && currentStep === 2 && renderStep2()}
          {!bookingConfirmed && currentStep === 3 && renderStep3()}
          {!bookingConfirmed && currentStep === 4 && renderStep4()}
          {!bookingConfirmed && currentStep === 5 && renderStep5()}
          {!bookingConfirmed && currentStep === 6 && renderStep6()}
          {!bookingConfirmed && currentStep === 7 && renderStep7()}
          {bookingConfirmed && renderSuccess()}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default BookingModal;
