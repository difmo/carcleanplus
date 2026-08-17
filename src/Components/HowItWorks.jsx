import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaCar, FaCalendarCheck, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import chooseYourCarImg from '../assets/choose your car .png';
import selectTimeImg from '../assets/select time .png';
import enterLocationImg from '../assets/location.png';
import relaxImg from '../assets/relax.png';

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
      image: selectTimeImg,
      title: 'Select Service & Time',
      description: 'Pick your wash service and preferred time slot.',
      step: 2,
      icon: <FaCalendarCheck className="text-2xl text-[#2563eb]" />
    },
    {
      image: enterLocationImg,
      title: 'Enter Location',
      description: 'Add your address. We come to your doorstep!',
      step: 3,
      icon: <FaMapMarkerAlt className="text-2xl text-[#2563eb]" />
    },
    {
      image: relaxImg,
      title: 'Relax & Enjoy',
      description: 'Sit back while we clean your car to perfection.',
      step: 4,
      icon: <FaStar className="text-2xl text-[#2563eb]" />
    }
  ];

  return (
    <section className="pt-16 pb-16 bg-transparent relative z-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 tracking-tight">
            Seamless & Effortless
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience a premium car care journey. From booking to a sparkling finish, we've designed everything around your absolute convenience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center w-full cursor-pointer group transition-all duration-300"
              onClick={() => openModal(null, null, step.step)}
            >
              {/* Image Section */}
              <div className="w-full h-[220px] relative mb-12 overflow-hidden rounded-[24px] border border-white/10 shadow-sm transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] opacity-50 z-10"></div>
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover transition-transform duration-500"
                />
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-base shadow-md z-20">
                  {step.step}
                </div>
                
                {/* Icon Badge overlapping bottom of image */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[72px] h-[72px] bg-[#0a0a0a] border border-white/10 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,82,204,0.7)] z-30 transition-colors">
                  <div className="w-[60px] h-[60px] rounded-full border border-primary-light/30 flex items-center justify-center bg-primary-light/10 transition-colors">
                    {React.cloneElement(step.icon, { className: 'text-2xl text-primary' })}
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="px-6 pb-8 w-full mt-2">
                <h3 className="text-xl font-serif italic font-extrabold text-white mb-3 underline decoration-primary decoration-4 underline-offset-[6px] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-base leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
