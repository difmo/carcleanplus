import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaCar, FaCalendarCheck, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import chooseYourCarImg from '../assets/choose your car .png';

const HowItWorks = () => {
  const { openModal } = useBooking();

  const steps = [
    {
      image: chooseYourCarImg,
      title: 'Choose Your Car',
      description: 'Search and select your exact car model.',
      step: 1,
      icon: <FaCar className="text-2xl text-[#2563eb]" />
    },
    {
      image: 'https://images.unsplash.com/photo-1517594422361-5e18140cf61c?auto=format&fit=crop&q=80&w=600',
      title: 'Select Service & Time',
      description: 'Pick your wash service and preferred time slot.',
      step: 2,
      icon: <FaCalendarCheck className="text-2xl text-[#2563eb]" />
    },
    {
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
      title: 'Enter Location',
      description: 'Add your address. We come to your doorstep!',
      step: 3,
      icon: <FaMapMarkerAlt className="text-2xl text-[#2563eb]" />
    },
    {
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600',
      title: 'Relax & Enjoy',
      description: 'Sit back while we clean your car to perfection.',
      step: 4,
      icon: <FaStar className="text-2xl text-[#2563eb]" />
    }
  ];

  return (
    <section className="pt-16 pb-16 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="text-[#2563eb] text-xs font-bold tracking-widest uppercase bg-transparent border border-[#2563eb]/30 px-5 py-1.5 rounded-full mb-4 inline-block">
            4 SIMPLE STEPS
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#0f172a] mb-4 tracking-tight">How It Works</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium">Get your car sparkling clean in just a few easy steps.</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              onClick={openModal}
              className="group bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="w-full h-[220px] relative mb-12 overflow-hidden bg-gray-100">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-base shadow-md z-10">
                  {step.step}
                </div>
                
                {/* Icon Badge overlapping bottom of image */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgb(0,0,0,0.1)] z-20">
                  <div className="w-[60px] h-[60px] rounded-full border border-blue-50 flex items-center justify-center bg-blue-50/50">
                    {step.icon}
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="px-6 pb-8 w-full mt-2">
                <h3 className="text-xl font-bold text-[#2563eb] mb-3">{step.title}</h3>
                <p className="text-gray-500 text-base leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
