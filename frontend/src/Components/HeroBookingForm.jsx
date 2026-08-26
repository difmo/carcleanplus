import React, { useState } from 'react';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { MdLocalCarWash } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';

const HeroBookingForm = () => {
  const { updateBooking, openModal } = useBooking();
  const [formData, setFormData] = useState({
    carType: '',
    service: '',
    location: '',
    date: '',
    time: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update context
    if (formData.carType) updateBooking('carModel', { category: formData.carType, name: formData.carType });
    if (formData.service) updateBooking('service', formData.service);
    if (formData.location) updateBooking('location', { address: formData.location, pincode: '' });
    if (formData.date) updateBooking('date', formData.date);
    if (formData.time) updateBooking('timeSlot', formData.time);

    // Open modal at step 5 (customer details step)
    openModal(
      formData.carType ? { category: formData.carType, name: formData.carType } : null,
      formData.service || null,
      5 // Target the details form
    );
  };

  return (
    <div className="bg-[#0b1325]/90 backdrop-blur-md border border-[#1a2238] rounded-xl p-5 shadow-2xl w-full max-w-[340px] mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <FaCar className="text-lg" />
        </div>
        <h3 className="text-xl font-bold text-white">Book Your Car Wash</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        {/* Car Type */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <FaCar className="text-sm" />
          </div>
          <select
            name="carType"
            value={formData.carType}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 text-sm rounded-lg py-2.5 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            required
          >
            <option value="" disabled>Select Car Type</option>
            <option value="Compact">Hatchback / Compact</option>
            <option value="Standard">Sedan / Standard</option>
            <option value="Large">SUV/MUV / Large</option>
            <option value="Premium">Luxury / Premium</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Service */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <MdLocalCarWash className="text-base" />
          </div>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 text-sm rounded-lg py-2.5 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            required
          >
            <option value="" disabled>Select Service</option>
            <option value="Basic Wash">Basic Wash</option>
            <option value="Premium Wash">Premium Wash</option>
            <option value="Complete Clean">Complete Clean</option>
            <option value="Car Interior Cleaning">Car Interior Cleaning</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Location */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <FaMapMarkerAlt className="text-sm" />
          </div>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter Location"
            className="w-full bg-white text-gray-800 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            required
          />
        </div>

        {/* Date */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <FaCalendarAlt className="text-sm" />
          </div>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 text-sm rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            required
          />
        </div>

        {/* Time */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <FaClock className="text-sm" />
          </div>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full bg-white text-gray-800 text-sm rounded-lg py-2.5 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-primary font-medium"
            required
          >
            <option value="" disabled>Select Time</option>
            <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
            <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
            <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
            <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-bold py-3 rounded-lg mt-1 flex items-center justify-center gap-2 transition-colors shadow-blue-glow"
        >
          BOOK NOW <FaArrowRight />
        </button>
      </form>

      {/* Secure Booking Badge */}
      <div className="mt-3 bg-[#072414] border border-[#10b981]/30 rounded-lg p-2.5 flex items-center gap-2.5">
        <FaShieldAlt className="text-[#10b981] text-xl" />
        <div>
          <p className="text-white font-bold text-[13px] leading-tight">Secure Booking</p>
          <p className="text-gray-400 text-[11px] mt-0.5">Your details are safe with us</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBookingForm;
