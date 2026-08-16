import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaCheckCircle } from 'react-icons/fa';
import heroImage from '../assets/home section.png';

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

      <div className="container mx-auto px-4 z-10 pt-32 pb-32 lg:pb-48">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
            ONE-TIME <span className="text-accent">DOORSTEP</span> <br />
            CAR WASH
          </h1>

          <div className="bg-primary/20 border border-primary/30 inline-block px-4 py-2 rounded-lg mb-6">
            <p className="text-xl md:text-2xl font-bold text-white">
              Starting at <span className="text-accent">₹299</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Professional car cleaning at your home or office. No Queue. No Travel. No Hassle. We bring professional car cleaning to your doorstep.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="flex items-center text-gray-200">
              <FaCheckCircle className="text-accent mr-3 text-xl" />
              <span className="font-medium">Doorstep Service</span>
            </div>
            <div className="flex items-center text-gray-200">
              <FaCheckCircle className="text-accent mr-3 text-xl" />
              <span className="font-medium">Professional Equipment</span>
            </div>
            <div className="flex items-center text-gray-200">
              <FaCheckCircle className="text-accent mr-3 text-xl" />
              <span className="font-medium">Clean Finish</span>
            </div>
            <div className="flex items-center text-gray-200">
              <FaCheckCircle className="text-accent mr-3 text-xl" />
              <span className="font-medium">Selected Areas Only</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mt-12 animate-fade-in-up">
            <button
              onClick={openModal}
              className="group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.7)] border-b-4 border-blue-800"
            >
              <span className="relative z-10 tracking-wider">BOOK A WASH</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
            <button
              onClick={() => {
                const section = document.getElementById("services");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md border-2 border-white/40 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-[#0f172a] hover:scale-105 hover:shadow-xl"
            >
              <span className="tracking-wider">View Services</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
