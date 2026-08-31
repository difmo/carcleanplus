import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaArrowRight, FaArrowCircleRight, FaShieldAlt, FaSprayCan, FaStar, FaClock } from 'react-icons/fa';
import heroImage from '../assets/car clean plus home 4.png';
import HeroBookingForm from './HeroBookingForm';

const HeroSection = () => {
  const { openModal } = useBooking();

  return (
    <div className="relative bg-white min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-white">
        <img
          src={heroImage}
          alt="Professional Car Wash"
          className="w-full h-full object-cover object-[70%_center] md:object-right opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/30 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 z-10 pt-28 pb-32 lg:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 mb-4 leading-tight">
              A Cleaner Car, <br />
              A <span className="text-primary">Better You.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
              Experience the best car wash & detailing services with Car Clean Plus. We make your car look new, every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => openModal()}
                className="flex items-center justify-center gap-2 bg-[#0052cc] text-white font-extrabold text-lg md:text-xl py-3.5 px-8 rounded-full transition-all duration-300 hover:bg-[#0043a8] hover:-translate-y-1 group w-fit"
              >
                <span>Starting at ₹299</span>
                <FaArrowRight className="text-white text-lg ml-1 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
              
              <button
                onClick={() => {
                  const section = document.getElementById("services");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border-[2px] border-[#0052cc] text-[#0052cc] font-bold text-lg md:text-xl py-3.5 px-8 rounded-full transition-all duration-300 hover:bg-[#0052cc] hover:text-white hover:-translate-y-1 group w-fit"
              >
                <span>Explore Services</span>
                <FaArrowCircleRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3 mt-5 w-full max-w-xl">
              {/* Feature 1 */}
              <div className="flex items-center gap-2.5 bg-white p-2.5 md:p-3 rounded-xl border border-gray-100 w-full hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-primary text-base md:text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-[13px] md:text-[14px] leading-tight">Professional Experts</span>
                  <span className="text-gray-500 text-[11px] md:text-[12px] mt-0.5">Trained & Verified</span>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex items-center gap-2.5 bg-white p-2.5 md:p-3 rounded-xl border border-gray-100 w-full hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FaSprayCan className="text-primary text-base md:text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-[13px] md:text-[14px] leading-tight">Premium Products</span>
                  <span className="text-gray-500 text-[11px] md:text-[12px] mt-0.5">Safe for Your Car</span>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex items-center gap-2.5 bg-white p-2.5 md:p-3 rounded-xl border border-gray-100 w-full hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FaStar className="text-primary text-base md:text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-[13px] md:text-[14px] leading-tight">100% Satisfaction</span>
                  <span className="text-gray-500 text-[11px] md:text-[12px] mt-0.5">Quality Guaranteed</span>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="flex items-center gap-2.5 bg-white p-2.5 md:p-3 rounded-xl border border-gray-100 w-full hover:-translate-y-0.5 transition-transform duration-300">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-primary text-base md:text-lg" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-gray-900 text-[13px] md:text-[14px] leading-tight">On-time Service</span>
                  <span className="text-gray-500 text-[11px] md:text-[12px] mt-0.5">Punctual & Reliable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
