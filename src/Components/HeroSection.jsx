import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/home section.png';
import HeroBookingForm from './HeroBookingForm';

const HeroSection = () => {
  const { openModal } = useBooking();

  return (
    <div className="relative bg-dark min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={heroImage}
          alt="Professional Car Wash"
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 z-10 pt-28 pb-32 lg:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
              ONE-TIME <span className="text-primary">DOORSTEP</span> <br />
              CAR WASH
            </h1>

            <button 
              onClick={() => openModal()}
              className="bg-primary hover:bg-[#0043a8] inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 cursor-pointer transition-all duration-300 shadow-[0_10px_30px_rgba(0,82,204,0.4)] hover:shadow-[0_10px_40px_rgba(0,82,204,0.6)] hover:-translate-y-1 group"
            >
              <p className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                Starting at <span className="text-white/90">₹299</span>
              </p>
              <FaArrowRight className="text-white text-lg ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
              Professional car cleaning at your home or office. No Queue. No Travel. No Hassle. We bring professional car cleaning to your doorstep.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center text-gray-200">
                <FaCheckCircle className="text-primary mr-3 text-xl" />
                <span className="font-medium">Doorstep Service</span>
              </div>
              <div className="flex items-center text-gray-200">
                <FaCheckCircle className="text-primary mr-3 text-xl" />
                <span className="font-medium">Professional Equipment</span>
              </div>
              <div className="flex items-center text-gray-200">
                <FaCheckCircle className="text-primary mr-3 text-xl" />
                <span className="font-medium">Clean Finish</span>
              </div>
              <div className="flex items-center text-gray-200">
                <FaCheckCircle className="text-primary mr-3 text-xl" />
                <span className="font-medium">Selected Areas Only</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-6 animate-fade-in-up">
              <button
                onClick={() => {
                  const section = document.getElementById("services");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center bg-[#1e293b]/60 backdrop-blur-md border-[1.5px] border-gray-400/60 text-white font-bold text-base py-3 px-8 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 w-fit"
              >
                <span>View Services</span>
              </button>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="w-full mt-8 lg:mt-0 flex justify-center lg:justify-end">
            <HeroBookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
