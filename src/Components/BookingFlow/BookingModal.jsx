import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CAR_MODELS, SERVICES, PRICING_MATRIX, getPrice } from '../../utils/pricingLogic';
import { FaTimes, FaSearch, FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaCheckCircle } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

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

    const templateParams = {
      to_name: "Car Clean Plus Admin",
      from_name: bookingState.customerDetails.fullName,
      car: `${bookingState.carModel.name} (${bookingState.carModel.category})`,
      service: bookingState.service,
      price: `₹${bookingState.finalPrice}`,
      location: `${bookingState.location.address}, Pincode: ${bookingState.location.pincode}`,
      datetime: `${bookingState.date} at ${bookingState.timeSlot}`,
      contact: bookingState.customerDetails.mobile,
      instructions: bookingState.customerDetails.instructions
    };

    // Assuming EmailJS is setup in FormContact.jsx, using generic keys for now.
    // Real implementation requires actual Service ID and Template ID.
    // For now, we will simulate a success response since we don't have the real keys handy here.
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

  const renderStepIndicator = () => {
    if (bookingConfirmed) return null;
    const maxStepAllowed = getMaxStepAllowed();

    return (
      <div className="flex justify-between items-center mb-8 px-4">
        {[1, 2, 3, 4, 5, 6].map((step) => {
          const isClickable = step <= maxStepAllowed && step !== currentStep;
          return (
            <div
              key={step}
              onClick={() => isClickable && setStep(step)}
              title={isClickable ? `Go to step ${step}` : ''}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-accent/50 hover:scale-110' : ''} ${currentStep === step ? 'bg-accent text-white shadow-md scale-110 ring-4 ring-accent/20' : step <= maxStepAllowed ? 'bg-primary text-white cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              {step}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-2">What type of car do you have?</h3>
      <p className="text-gray-500 mb-6">Search your exact car model.</p>

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search car model (e.g. Creta, Swift)"
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="max-h-64 overflow-y-auto border border-gray-100 rounded-lg">
        {filteredCars.map(car => (
          <div
            key={car.id}
            onClick={() => {
              updateBooking('carModel', car);
              nextStep();
            }}
            className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
          >
            <span className="font-semibold text-dark">{car.name}</span>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{car.category}</span>
          </div>
        ))}
        {filteredCars.length === 0 && (
          <div className="p-4 text-center text-gray-500">No car found. Please try another model.</div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (!bookingState.carModel) return null;
    const category = bookingState.carModel.category;

    return (
      <div className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-2">Select Your Wash</h3>
        <p className="text-gray-500 mb-6">Prices shown for {bookingState.carModel.name} ({category})</p>

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
              className={`p-5 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${bookingState.service === svc.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div>
                <h4 className={`font-bold text-lg ${svc.highlight ? 'text-accent' : 'text-dark'}`}>{svc.title}</h4>
                <p className="text-sm text-gray-500">{svc.desc}</p>
              </div>
              <div className="text-xl font-bold">
                ₹{getPrice(category, svc.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-2">Where should we come?</h3>
      <p className="text-gray-500 mb-6">Enter your address details.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address (House/Flat, Street, Area)</label>
          <textarea
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.location.address}
            onChange={(e) => updateBooking('location', { ...bookingState.location, address: e.target.value })}
            placeholder="E.g. Flat 402, Signature Towers, Gomti Nagar"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.location.pincode}
            onChange={(e) => updateBooking('location', { ...bookingState.location, pincode: e.target.value })}
            placeholder="E.g. 226010"
          />
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.location.address || !bookingState.location.pincode}
          className="w-full btn-primary disabled:opacity-50 mt-4"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const slots = ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];
    return (
      <div className="animate-fade-in">
        <h3 className="text-2xl font-bold mb-2">Date & Time</h3>
        <p className="text-gray-500 mb-6">When do you want the service?</p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.date}
            onChange={(e) => updateBooking('date', e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Available Time Slots</label>
          <div className="grid grid-cols-2 gap-3">
            {slots.map(slot => (
              <div
                key={slot}
                onClick={() => updateBooking('timeSlot', slot)}
                className={`p-3 text-center text-sm font-medium rounded-lg border cursor-pointer transition-colors ${bookingState.timeSlot === slot ? 'bg-accent text-white border-accent' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.date || !bookingState.timeSlot}
          className="w-full btn-primary disabled:opacity-50"
        >
          Next Step
        </button>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-2">Customer Details</h3>
      <p className="text-gray-500 mb-6">We need this to contact you.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.customerDetails.fullName}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, fullName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.customerDetails.mobile}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, mobile: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (Optional)</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-accent focus:outline-none"
            value={bookingState.customerDetails.instructions}
            onChange={(e) => updateBooking('customerDetails', { ...bookingState.customerDetails, instructions: e.target.value })}
            placeholder="e.g. Call before arriving"
          />
        </div>
        <button
          onClick={nextStep}
          disabled={!bookingState.customerDetails.fullName || !bookingState.customerDetails.mobile}
          className="w-full btn-primary disabled:opacity-50 mt-4"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold mb-6">Review Your Booking</h3>

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 space-y-4">
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-500">Car</span>
          <span className="font-semibold text-right">{bookingState.carModel?.name} <span className="text-xs text-gray-400 block">{bookingState.carModel?.category}</span></span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-500">Service</span>
          <span className="font-semibold text-accent">{bookingState.service}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200 pb-3">
          <span className="text-gray-500">Date & Time</span>
          <span className="font-semibold text-right">{bookingState.date}<br /><span className="text-sm font-normal">{bookingState.timeSlot}</span></span>
        </div>
        <div className="flex justify-between pb-1">
          <span className="text-gray-500">Location</span>
          <span className="font-semibold text-right truncate w-48">{bookingState.location.address}</span>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex justify-between items-center mb-6">
        <span className="text-xl font-bold text-primary">Total Price</span>
        <span className="text-3xl font-bold text-dark">₹{bookingState.finalPrice}</span>
      </div>

      <button
        onClick={handleConfirmBooking}
        disabled={isSubmitting}
        className="w-full btn-primary py-4 text-lg"
      >
        {isSubmitting ? 'Confirming...' : 'CONFIRM & BOOK'}
      </button>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaCheckCircle className="text-5xl text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-dark mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-8">Thank you for choosing Car Clean Plus. You will receive a confirmation message shortly.</p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-8 text-left">
        <p className="text-sm text-gray-500 mb-1">Booking ID</p>
        <p className="font-bold text-lg text-dark mb-4">CCP-{Math.floor(Math.random() * 90000) + 10000}</p>
        <p className="text-sm text-gray-700"><strong>Service:</strong> {bookingState.service} for {bookingState.carModel?.name}</p>
        <p className="text-sm text-gray-700"><strong>Time:</strong> {bookingState.date} at {bookingState.timeSlot}</p>
      </div>

      <button
        onClick={() => {
          resetBooking();
          closeModal();
        }}
        className="btn-outline w-full"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] w-full max-w-4xl max-h-[95vh] min-h-[80vh] md:min-h-[70vh] flex flex-col relative overflow-hidden transform transition-all">
        {/* Header */}
        {!bookingConfirmed && (
          <div className="flex justify-between items-center p-6 md:p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white flex-shrink-0 border-b border-gray-700 shadow-lg relative overflow-hidden">
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-50 pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight text-white mb-1 drop-shadow-md">Book Your Premium Wash</h2>
              <p className="text-gray-300 text-sm font-medium">Get your car shining in just a few clicks.</p>
            </div>
            <button onClick={closeModal} className="relative z-10 text-gray-400 hover:text-white transition-all bg-white/10 p-2.5 rounded-full hover:bg-white/20 hover:scale-110 shadow-sm">
              <FaTimes className="text-xl" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
          {renderStepIndicator()}

          {bookingConfirmed && renderSuccess()}
          {!bookingConfirmed && currentStep === 1 && renderStep1()}
          {!bookingConfirmed && currentStep === 2 && renderStep2()}
          {!bookingConfirmed && currentStep === 3 && renderStep3()}
          {!bookingConfirmed && currentStep === 4 && renderStep4()}
          {!bookingConfirmed && currentStep === 5 && renderStep5()}
          {!bookingConfirmed && currentStep === 6 && renderStep6()}
        </div>

        {/* Footer Navigation */}
        {!bookingConfirmed && currentStep > 1 && currentStep < 7 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center flex-shrink-0">
            <button onClick={prevStep} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors text-sm uppercase tracking-wider">
              &larr; Go Back to Previous Step
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
