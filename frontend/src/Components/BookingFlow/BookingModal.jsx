import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CAR_MODELS, SERVICES, getPrice } from '../../utils/pricingLogic';
import { FaTimes, FaSearch, FaCar, FaCheckCircle, FaMapMarkerAlt, FaArrowLeft, FaChevronRight, FaCalendarAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import { SiSuzuki, SiHyundai, SiTata, SiHonda, SiToyota, SiVolkswagen, SiSkoda, SiKia, SiRenault, SiNissan, SiFord, SiJeep, SiAudi, SiBmw, SiFiat, SiChevrolet, SiMercedes, SiVolvo } from 'react-icons/si';

const getCarIcon = (carName) => {
  if (!carName) return <FaCar />;
  const name = carName.toLowerCase();
  if (name.includes('maruti') || name.includes('suzuki')) return <SiSuzuki />;
  if (name.includes('hyundai')) return <SiHyundai />;
  if (name.includes('tata')) return <SiTata />;
  if (name.includes('honda')) return <SiHonda />;
  if (name.includes('toyota')) return <SiToyota />;
  if (name.includes('volkswagen')) return <SiVolkswagen />;
  if (name.includes('skoda')) return <SiSkoda />;
  if (name.includes('kia')) return <SiKia />;
  if (name.includes('renault')) return <SiRenault />;
  if (name.includes('nissan')) return <SiNissan />;
  if (name.includes('ford')) return <SiFord />;
  if (name.includes('jeep')) return <SiJeep />;
  if (name.includes('audi')) return <SiAudi />;
  if (name.includes('bmw')) return <SiBmw />;
  if (name.includes('fiat')) return <SiFiat />;
  if (name.includes('chevrolet')) return <SiChevrolet />;
  if (name.includes('mercedes')) return <SiMercedes />;
  if (name.includes('volvo')) return <SiVolvo />;
  if (name.includes('mg')) return <span className="font-black font-serif text-xl">MG</span>;
  if (name.includes('mahindra')) return <span className="font-black font-serif text-xl">M</span>;
  if (name.includes('citroën') || name.includes('citroen')) return <span className="font-black font-serif text-xl">C</span>;
  if (name.includes('datsun')) return <span className="font-black font-serif text-xl">D</span>;
  if (name.includes('bajaj')) return <span className="font-black font-serif text-xl">B</span>;
  if (name.includes('jaguar')) return <span className="font-black font-serif text-xl">J</span>;
  if (name.includes('land rover') || name.includes('range rover')) return <span className="font-black font-serif text-xl">LR</span>;
  if (name.includes('lexus')) return <span className="font-black font-serif text-xl">L</span>;
  if (name.includes('porsche')) return <span className="font-black font-serif text-xl">P</span>;
  if (name.includes('mini')) return <span className="font-black font-serif text-xl">M</span>;
  if (name.includes('maserati')) return <span className="font-black font-serif text-xl">M</span>;
  if (name.includes('bentley')) return <span className="font-black font-serif text-xl">B</span>;
  if (name.includes('rolls-royce') || name.includes('rolls royce')) return <span className="font-black font-serif text-xl">RR</span>;
  if (name.includes('aston martin')) return <span className="font-black font-serif text-xl">AM</span>;
  if (name.includes('lamborghini')) return <span className="font-black font-serif text-xl">L</span>;
  if (name.includes('ferrari')) return <span className="font-black font-serif text-xl">F</span>;
  return <FaCar />;
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

  const CITIES = ['Lucknow'];

  const BRANDS = useMemo(() => {
    const brandSet = new Set();
    CAR_MODELS.forEach(car => {
      const brand = car.name.split(' ')[0];
      brandSet.add(brand);
    });
    return Array.from(brandSet).sort();
  }, []);

  if (!isModalOpen) return null;

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));
  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(searchBrand.toLowerCase()));

  const brandModels = CAR_MODELS.filter(car => car.name.startsWith(bookingState.carBrand));
  const filteredModels = brandModels.filter(car => car.name.toLowerCase().includes(searchModel.toLowerCase()));

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
      const orderRes = await fetch('http://localhost:5000/api/payment/create-order', {
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
      const options = {
        key: "rzp_test_TUHd7o8zEcyLCG",
        amount: orderData.data.amount,
        currency: "INR",
        name: "Car Clean Plus",
        description: "Payment for " + bookingState.service,
        order_id: orderData.data.id,
        handler: async function (response) {
          // Verify on backend
          const verifyRes = await fetch('http://localhost:5000/api/payment/verify-payment', {
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
          name: "Customer",
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
      paymentObject.open();

    } catch (err) {
      alert("Error initializing payment. Please try again.");
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const submitFinalBooking = async (paymentId, orderId, paymentStatus) => {
    try {
      const payload = {
        carModel: bookingState.carModel,
        service: bookingState.service,
        location: { address: 'To be confirmed on call', pincode: 'N/A', city: bookingState.city },
        date: bookingState.date || 'To be decided',
        timeSlot: bookingState.timeSlot || 'TBD',
        customerDetails: {
          fullName: 'Customer',
          mobile: bookingState.mobile,
          instructions: 'Call customer to confirm location and time.'
        },
        finalPrice: bookingState.finalPrice || 0,
        paymentId,
        orderId,
        paymentStatus
      };

      const response = await fetch(`http://localhost:5000/api/booking/${bookingState.bookingId}`, {
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
      const response = await fetch('http://localhost:5000/api/booking/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: bookingState.mobile })
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
        <p className="text-gray-500 text-[13px] px-6 leading-relaxed">Enter your mobile number to view exact prices and available slots.</p>
      </div>

      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0052cc] focus-within:ring-2 focus-within:ring-[#0052cc]/10 transition-all mb-4 shadow-sm">
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

      <div className="mt-auto pt-6">
        <button 
          onClick={handleMobileSubmit}
          disabled={bookingState.mobile.length < 10 || isSubmitting}
          className={`w-full font-extrabold py-3.5 rounded-xl text-[15px] transition-all shadow-md ${
            bookingState.mobile.length >= 10 && !isSubmitting ? 'bg-[#0052cc] text-white hover:bg-[#003380] hover:shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
          <span className="font-extrabold text-gray-900 text-base">Select City</span>
        </div>
        <div className="p-3 bg-white border-b border-gray-50 sticky top-0 z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search city..."
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
              className="px-5 py-3.5 mx-2 my-1 rounded-xl text-gray-600 text-[15px] font-bold hover:bg-blue-50 hover:text-[#003380] cursor-pointer transition-all flex justify-between items-center group"
            >
              {city}
              <FaChevronRight className="text-[#0052cc] opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
            </div>
          ))}
          {filteredCities.length === 0 && <div className="p-4 text-center text-[14px] text-gray-400 font-medium">No city found</div>}
        </div>
      </div>

      <div className="mt-4 pt-1 pb-1">
        <button disabled className="w-full bg-gray-100 text-gray-400 font-extrabold py-3 rounded-xl text-[15px] cursor-not-allowed">Continue</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in relative flex flex-col h-full">
      {renderCloseButton()}
      {renderBackButton()}

      {renderHeaderIcon()}
      <div className="text-center mb-5">
        <h2 className="text-[24px] font-black text-gray-900 mb-1.5 tracking-tight">Select Vehicle Make</h2>
        <p className="text-gray-500 text-[13px] px-6 leading-relaxed">Choose your car details to see exact prices and available slots.</p>
      </div>

      <div className="relative mb-4 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
        </div>
        <input
          type="text"
          placeholder="Search car brand..."
          className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-9 pr-3 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300"
          value={searchBrand}
          onChange={e => setSearchBrand(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 overflow-y-auto custom-scrollbar flex-1 pb-4 content-start min-h-[160px]">
        {filteredBrands.map(brand => (
          <div
            key={brand}
            onClick={() => {
              updateBooking('carBrand', brand);
              nextStep();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-[#0052cc] hover:-translate-y-0.5 cursor-pointer transition-all aspect-[4/3] gap-1.5 group"
          >
            <div className="text-2xl text-gray-700 group-hover:text-blue-500 flex items-center justify-center h-6 transition-colors">{getCarIcon(brand)}</div>
            <span className="text-[10px] font-extrabold text-gray-800 tracking-wide text-center uppercase group-hover:text-[#0043a8] transition-colors">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );

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

      <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar flex-1 pb-4 content-start min-h-[160px] px-1">
        {filteredModels.map(car => (
          <div
            key={car.id}
            onClick={() => {
              updateBooking('carModel', car);
              nextStep();
            }}
            className="flex flex-col items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-[#0052cc] hover:-translate-y-1 cursor-pointer transition-all aspect-[4/3] group"
          >
            <FaCar className="text-4xl text-gray-300 group-hover:text-blue-300 transition-colors" />
            <div className="text-center mt-2 w-full">
              <h4 className="font-extrabold text-gray-900 text-[13px] truncate">{car.name.replace(`${bookingState.carBrand} `, '')}</h4>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-extrabold mt-0.5 block">{car.category}</span>
            </div>
          </div>
        ))}
        {filteredModels.length === 0 && <div className="col-span-2 text-center py-6 text-gray-400 text-[14px] font-medium">No models found</div>}
      </div>
    </div>
  );

  const renderStep5 = () => {
    const category = bookingState.carModel?.category || 'STANDARD';
    const packages = [
      { id: SERVICES.BASIC, title: 'Bucket Wash - Basic', reviews: '2.5k reviews', rating: '3.9', features: ['Exterior Ceramic Wash', 'Tyre Polish'] },
      { id: SERVICES.PREMIUM, title: 'Pressure Wash - Premium', reviews: '6.8k reviews', rating: '4.6', features: ['Exterior High Pressure Wash', 'Tyre Polish'] },
      { id: SERVICES.COMPLETE, title: '360 Deep Cleaning', reviews: '3.2k reviews', rating: '4.4', features: ['Interior Vacuum', 'Roof Cleaning', 'Seat Cleaning'] }
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
              <div className="w-[50px] h-[50px] bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                <FaCar className="text-gray-300 text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-gray-900 text-[13px] leading-tight truncate">{pkg.title}</h4>
                <div className="flex items-center gap-2 mt-0.5 mb-1">
                  <div className="font-black text-gray-900 text-[16px]">₹{getPrice(category, pkg.id)}</div>
                  <div className="bg-blue-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="text-[#0052cc] text-[9px]">★</span>
                    <span className="font-bold text-gray-900 text-[10px]">{pkg.rating}</span>
                  </div>
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
          <h2 className="text-[22px] font-black text-gray-900 mb-1.5 tracking-tight leading-tight">When should we<br/>arrive?</h2>
          <p className="text-gray-500 text-[13px] px-4 font-medium">
            Select your preferred exact date and time.
          </p>
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
                onChange={(e) => updateBooking('date', e.target.value)}
                className="w-full bg-white border-2 border-gray-100 hover:border-[#0052cc]/40 focus:border-[#0052cc] px-4 py-3 rounded-xl text-[14px] font-bold text-gray-900 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-800 mb-2 uppercase tracking-widest pl-1 flex items-center gap-1.5">
              <FaClock className="text-[#0052cc]" /> Select Exact Time
            </label>
            <div className="relative">
              <input 
                type="time" 
                value={bookingState.timeSlot}
                onChange={(e) => updateBooking('timeSlot', e.target.value)}
                className="w-full bg-white border-2 border-gray-100 hover:border-[#0052cc]/40 focus:border-[#0052cc] px-4 py-3 rounded-xl text-[14px] font-bold text-gray-900 outline-none transition-all shadow-sm"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 ml-1">
              Choose the exact time. The admin will review and accept this slot.
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

      <div className="mt-auto pt-4 pb-1">
        <button
          onClick={handlePaymentAndBooking}
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white font-black py-3.5 rounded-xl text-[16px] hover:bg-black transition-all disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 shadow-md disabled:shadow-none"
        >
          {isSubmitting ? 'Processing...' : `Pay ₹${bookingState.finalPrice || 0}`}
        </button>
      </div>
    </div>
  );

  const getWhatsAppLink = () => {
    const adminPhone = "919120759988";
    const bookingId = `CCP-${createdBookingId || Math.floor(Math.random() * 90000) + 10000}`;
    const message = `Hello Car Clean Plus, my booking is confirmed!\n\n*Booking ID:* ${bookingId}\n*Service:* ${bookingState.service}\n*Vehicle:* ${bookingState.carModel?.name}\n*City:* ${bookingState.city}\n*Mobile:* ${bookingState.mobile}\n*Amount Paid:* ₹${bookingState.finalPrice}\n\nPlease contact me to confirm the location and time.`;
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

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => {
            resetBooking();
            closeModal();
          }}
          className="w-1/2 bg-gray-100 text-gray-900 hover:bg-gray-200 font-black py-3.5 px-2 rounded-xl transition-all text-[14px] shadow-sm"
        >
          Close
        </button>
        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-1/2 bg-[#25D366] text-white hover:bg-[#1ebe5d] flex items-center justify-center gap-2 font-black py-3.5 px-2 rounded-xl transition-all text-[14px] shadow-md"
        >
          <FaWhatsapp className="text-xl" />
          WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[360px] max-h-[90vh] flex flex-col relative overflow-hidden transform transition-all border border-gray-100">
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
