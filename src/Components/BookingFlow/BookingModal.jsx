import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CAR_MODELS, SERVICES, PRICING_MATRIX, getPrice } from '../../utils/pricingLogic';
import { FaTimes, FaSearch, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import { SiSuzuki, SiHyundai, SiTata, SiHonda, SiToyota, SiVolkswagen, SiSkoda, SiKia, SiRenault, SiNissan, SiFord, SiJeep } from 'react-icons/si';

const getCarIcon = (carName) => {
  const name = carName.toLowerCase();
  if (name.includes('maruti') || name.includes('suzuki')) return <SiSuzuki className="text-2xl" />;
  if (name.includes('hyundai')) return <SiHyundai className="text-2xl" />;
  if (name.includes('tata')) return <SiTata className="text-3xl" />;
  if (name.includes('honda')) return <SiHonda className="text-3xl" />;
  if (name.includes('toyota')) return <SiToyota className="text-3xl" />;
  if (name.includes('volkswagen')) return <SiVolkswagen className="text-2xl" />;
  if (name.includes('skoda')) return <SiSkoda className="text-2xl" />;
  if (name.includes('kia')) return <SiKia className="text-3xl" />;
  if (name.includes('renault')) return <SiRenault className="text-2xl" />;
  if (name.includes('nissan')) return <SiNissan className="text-2xl" />;
  if (name.includes('ford')) return <SiFord className="text-2xl" />;
  if (name.includes('jeep')) return <SiJeep className="text-2xl" />;
  return <FaCar className="text-2xl" />;
};

const BookingModal = () => {
  const { bookingState, updateBooking, nextStep, prevStep, setStep, closeModal, resetBooking } = useBooking();
  const { isModalOpen, currentStep } = bookingState;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  if (!isModalOpen) return null;

  const filteredCars = CAR_MODELS.filter(car =>
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 1500);
  };

  const getMaxStepAllowed = () => {
    if (!bookingState.carModel) return 1;
    if (!bookingState.service) return 2;
    if (!bookingState.location.address || !bookingState.location.pincode) return 3;
    if (!bookingState.date || !bookingState.timeSlot) return 4;
    if (!bookingState.customerDetails.fullName || !bookingState.customerDetails.mobile) return 5;
    return 6;
  };

  const stepLabels = ['CAR TYPE', 'SERVICE', 'ADD-ONS', 'DATE & TIME', 'DETAILS', 'CONFIRMATION'];

  const renderStepIndicator = () => {
    if (bookingConfirmed) return null;
    const maxStepAllowed = getMaxStepAllowed();

    return (
      <div className="flex justify-between items-start mb-10 px-2 md:px-8 relative">
        {/* Background line */}
        <div className="absolute top-[19px] left-[10%] right-[10%] h-[1px] bg-[#333] -z-10"></div>
        
        {[1, 2, 3, 4, 5, 6].map((step, index) => {
          const isClickable = step <= maxStepAllowed && step !== currentStep;
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center z-10 group relative w-16">
              {/* Active gold line connecting from previous */}
              {isCompleted && index < 5 && (
                <div className="absolute top-[19px] left-[50%] w-[200%] h-[1px] bg-[#eab308] -z-10"></div>
              )}
              <div
                onClick={() => isClickable && setStep(step)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-2 
                ${isClickable ? 'cursor-pointer hover:ring-1 hover:ring-[#eab308]' : ''} 
                ${isActive ? 'bg-[#0a0a0a] text-[#eab308] border border-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 
                  isCompleted ? 'bg-[#111] text-gray-400 border border-[#333]' : 'bg-[#0a0a0a] text-gray-600 border border-[#333] cursor-not-allowed'}`}
              >
                {step}
              </div>
              <span className={`text-[9px] md:text-[10px] tracking-wider uppercase font-semibold text-center leading-tight mt-1 ${isActive ? 'text-[#eab308]' : isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                {stepLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="animate-fade-in text-white">
      <h3 className="text-2xl font-bold mb-2 text-white">What type of car do you have?</h3>
      <p className="text-gray-400 mb-6 text-sm">Search your exact car model.</p>

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-[#eab308]" />
        <input
          type="text"
          placeholder="Search car model (e.g. Creta, Swift)"
          className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-[#eab308] rounded-lg focus:outline-none text-white placeholder-gray-600 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.1)]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="max-h-72 overflow-y-auto border border-[#333] rounded-xl bg-[#0a0a0a] custom-scrollbar">
        {filteredCars.map(car => (
          <div
            key={car.id}
            onClick={() => {
              updateBooking('carModel', car);
              nextStep();
            }}
            className="p-4 border-b border-[#222] hover:bg-[#111] cursor-pointer flex justify-between items-center transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                {getCarIcon(car.name)}
              </div>
              <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{car.name}</span>
            </div>
            <span className="text-[11px] border border-[#eab308]/30 text-[#eab308] px-3 py-1 rounded-md bg-transparent font-medium">{car.category}</span>
          </div>
        ))}
        {filteredCars.length === 0 && (
          <div className="p-8 text-center text-gray-500">No car found. Please try another model.</div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (!bookingState.carModel) return null;
    const category = bookingState.carModel.category;

    return (
      <div className="animate-fade-in text-white">
        <h3 className="text-2xl font-bold mb-2 text-white">Select Your Wash</h3>
        <p className="text-gray-400 mb-6 text-sm">Prices shown for {bookingState.carModel.name} ({category})</p>

        <div className="space-y-4">
          {[
            { id: SERVICES.BASIC, title: 'Basic Wash', desc: 'Exterior wash & dry' },
            { id: SERVICES.PREMIUM, title: 'Premium Wash', desc: 'Exterior + Basic Interior (Recommended)', highlight: true },
            { id: SERVICES.COMPLETE, title: 'Complete Clean', desc: 'Detailed Interior & Exterior' }
          ].map(svc => (
            <div
              key={svc.id}
              onClick={() => {
                updateBooking('service', svc.id);
                nextStep();
              }}
              className={`p-5 rounded-xl border cursor-pointer flex justify-between items-center transition-all bg-[#0a0a0a] ${bookingState.service === svc.id ? 'border-[#eab308] bg-[#eab308]/5 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-[#333] hover:border-[#555]'}`}
            >
              <div>
                <h4 className={`font-bold text-lg ${svc.highlight ? 'text-[#eab308]' : 'text-gray-200'}`}>{svc.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{svc.desc}</p>
              </div>
              <div className="text-xl font-bold text-white">
                ₹{getPrice(category, svc.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="animate-fade-in text-white">
      <h3 className="text-2xl font-bold mb-2 text-white">Where should we come?</h3>
      <p className="text-gray-400 mb-6 text-sm">Enter your address details.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Complete Address (House/Flat, Street, Area)</label>
          <textarea
            rows="3"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white placeholder-gray-600"
            value={bookingState.location.address}
            onChange={(e) => updateBooking('location', { ...bookingState.location, address: e.target.value })}
            placeholder="E.g. Flat 402, Signature Towers, Gomti Nagar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Pincode</label>
          <input
            type="text"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white placeholder-gray-600"
            value={bookingState.location.pincode}
            onChange={(e) => updateBooking('location', { ...bookingState.location, pincode: e.target.value })}
            placeholder="E.g. 226010"
          />
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.location.address || !bookingState.location.pincode}
          className="w-full bg-[#eab308] text-[#0a0a0a] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[#d4af37] disabled:opacity-50 mt-4 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const slots = ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];
    return (
      <div className="animate-fade-in text-white">
        <h3 className="text-2xl font-bold mb-2 text-white">Date & Time</h3>
        <p className="text-gray-400 mb-6 text-sm">When do you want the service?</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Select Date</label>
          <input
            type="date"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white custom-date-input"
            value={bookingState.date}
            onChange={(e) => updateBooking('date', e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">Available Time Slots</label>
          <div className="grid grid-cols-2 gap-3">
            {slots.map(slot => (
              <div
                key={slot}
                onClick={() => updateBooking('timeSlot', slot)}
                className={`p-3 text-center text-sm font-medium rounded-lg border cursor-pointer transition-all bg-[#0a0a0a] ${bookingState.timeSlot === slot ? 'text-[#eab308] border-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.15)]' : 'border-[#333] text-gray-400 hover:border-[#555]'}`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.date || !bookingState.timeSlot}
          className="w-full bg-[#eab308] text-[#0a0a0a] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[#d4af37] disabled:opacity-50 mt-2 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="animate-fade-in text-white">
      <h3 className="text-2xl font-bold mb-2 text-white">Customer Details</h3>
      <p className="text-gray-400 mb-6 text-sm">We need this to contact you.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white placeholder-gray-600"
            value={bookingState.customerDetails.fullName}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, fullName: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
          <input
            type="tel"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white placeholder-gray-600"
            value={bookingState.customerDetails.mobile}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, mobile: e.target.value })}
            placeholder="+91 9876543210"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Special Instructions (Optional)</label>
          <input
            type="text"
            className="w-full p-3 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#eab308] focus:outline-none text-white placeholder-gray-600"
            value={bookingState.customerDetails.instructions}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, instructions: e.target.value })}
            placeholder="e.g. Call before arriving"
          />
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.customerDetails.fullName || !bookingState.customerDetails.mobile}
          className="w-full bg-[#eab308] text-[#0a0a0a] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[#d4af37] disabled:opacity-50 mt-4 disabled:cursor-not-allowed"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="animate-fade-in text-white">
      <h3 className="text-2xl font-bold mb-6 text-white">Review Your Booking</h3>

      <div className="bg-[#0a0a0a] p-5 rounded-xl border border-[#333] mb-6 space-y-4">
        <div className="flex justify-between border-b border-[#222] pb-3">
          <span className="text-gray-500">Car</span>
          <span className="font-semibold text-right text-gray-200">{bookingState.carModel?.name} <span className="text-xs text-[#eab308] block font-medium">{bookingState.carModel?.category}</span></span>
        </div>
        <div className="flex justify-between border-b border-[#222] pb-3">
          <span className="text-gray-500">Service</span>
          <span className="font-semibold text-[#eab308]">{bookingState.service}</span>
        </div>
        <div className="flex justify-between border-b border-[#222] pb-3">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-semibold text-right text-gray-200">{bookingState.date}<br /><span className="text-sm font-normal text-gray-400">{bookingState.timeSlot}</span></span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="text-gray-500">Location</span>
          <span className="font-semibold text-right text-gray-200 truncate w-48">{bookingState.location.address}</span>
        </div>
      </div>

      <div className="bg-[#eab308]/10 p-4 rounded-xl border border-[#eab308]/30 flex justify-between items-center mb-6">
        <span className="text-xl font-bold text-[#eab308]">Total Price</span>
        <span className="text-3xl font-bold text-white">₹{bookingState.finalPrice}</span>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={isSubmitting}
        className="w-full bg-[#eab308] text-[#0a0a0a] font-bold py-4 rounded-lg transition-all hover:bg-[#d4af37] disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(234,179,8,0.2)] disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Confirming...' : 'CONFIRM & BOOK'}
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8 animate-fade-in text-white">
      <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
        <FaCheckCircle className="text-5xl text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-[#eab308] mb-2">Booking Confirmed!</h2>
      <p className="text-gray-400 mb-8 text-sm">Thank you for choosing Car Clean Plus. You will receive a confirmation message shortly.</p>

      <div className="bg-[#0a0a0a] p-5 rounded-xl border border-[#333] mb-8 text-left">
        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Booking ID</p>
        <p className="font-bold text-xl text-white mb-4">CCP-{Math.floor(Math.random() * 90000) + 10000}</p>
        <p className="text-sm text-gray-300 mb-2"><strong className="text-gray-500">Service:</strong> {bookingState.service} for {bookingState.carModel?.name}</p>
        <p className="text-sm text-gray-300"><strong className="text-gray-500">Time:</strong> {bookingState.date} at {bookingState.timeSlot}</p>
      </div>

      <button
        onClick={() => {
          resetBooking();
          closeModal();
        }}
        className="border-2 border-[#eab308] text-[#eab308] hover:bg-[#eab308] hover:text-[#0a0a0a] font-bold py-3 px-8 rounded-lg transition-all w-full"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10 animate-fade-in">
      <div className="bg-[#111111] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-lg max-h-[95vh] min-h-[85vh] flex flex-col relative overflow-hidden transform transition-all border border-[#222]">
        
        {/* Header */}
        {!bookingConfirmed && (
          <div className="flex justify-between items-start p-6 md:p-8 bg-[#0a0a0a] flex-shrink-0 border-b border-[#222] relative overflow-hidden">
            {/* Background elements to simulate the car image */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#1a1a1a] to-transparent opacity-50"></div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#eab308] rounded-full blur-[100px] opacity-10"></div>
            
            <div className="relative z-10 flex gap-4 items-center">
              <div className="text-[#eab308] text-4xl">
                <FaCar className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase mb-1">Book Your</h2>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#eab308] mb-1 tracking-wide drop-shadow-md">PREMIUM WASH</h1>
                <p className="text-gray-400 text-sm font-medium">Get your car shining in just a few clicks.</p>
              </div>
            </div>
            <button onClick={closeModal} className="relative z-10 text-[#eab308] border border-[#eab308]/30 hover:text-[#111] transition-all bg-[#111] p-2.5 rounded-full hover:bg-[#eab308] shadow-sm">
              <FaTimes className="text-lg" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
          {renderStepIndicator()}

          <div className="max-w-2xl mx-auto">
            {bookingConfirmed && renderSuccess()}
            {!bookingConfirmed && currentStep === 1 && renderStep1()}
            {!bookingConfirmed && currentStep === 2 && renderStep2()}
            {!bookingConfirmed && currentStep === 3 && renderStep3()}
            {!bookingConfirmed && currentStep === 4 && renderStep4()}
            {!bookingConfirmed && currentStep === 5 && renderStep5()}
            {!bookingConfirmed && currentStep === 6 && renderStep6()}
          </div>
        </div>

        {/* Footer Navigation */}
        {!bookingConfirmed && currentStep > 1 && currentStep < 7 && (
          <div className="p-5 bg-[#0a0a0a] border-t border-[#222] flex justify-center flex-shrink-0">
            <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 font-semibold hover:text-[#eab308] transition-colors text-xs uppercase tracking-wider">
              &larr; Go Back to Previous Step
            </button>
          </div>
        )}
      </div>
      
      {/* Required css for custom-scrollbar and date input */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #eab308;
        }
        
        .custom-date-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BookingModal;

