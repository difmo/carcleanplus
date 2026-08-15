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
    <section className="pt-16 pb-16 bg-[#fafafa]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
            Seamless & Effortless
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Experience a premium car care journey. From booking to a sparkling finish, we've designed everything around your absolute convenience.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center w-full cursor-pointer group transition-all duration-300 hover:-translate-y-2"
              onClick={() => openModal(null, null, step.step)}
            >
              {/* Image Section */}
              <div className="w-full h-[220px] relative mb-12 overflow-hidden rounded-[24px] shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:ring-4 group-hover:ring-blue-500/20">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
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
