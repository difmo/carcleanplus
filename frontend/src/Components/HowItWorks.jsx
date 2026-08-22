import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaRegCalendarAlt, FaCarSide, FaMagic, FaThumbsUp } from 'react-icons/fa';

const HowItWorks = () => {
  const { openModal } = useBooking();

  const steps = [
    {
      title: 'Book Your Service',
      description: 'Choose your service and book easily online.',
      step: 1,
      icon: <FaRegCalendarAlt className="text-[32px] text-primary" />
    },
    {
      title: 'We Arrive On Time',
      description: 'Our experts reach your location on time.',
      step: 2,
      icon: <FaCarSide className="text-[36px] text-primary" />
    },
    {
      title: 'Premium Cleaning',
      description: 'We clean your car with care and precision.',
      step: 3,
      icon: <FaMagic className="text-[32px] text-primary" />
    },
    {
      title: 'You Relax & Enjoy',
      description: 'Sit back and enjoy your brand new car!',
      step: 4,
      icon: <FaThumbsUp className="text-[32px] text-primary" />
    }
  ];

  return (
    <section id="process" className="pt-24 pb-20 bg-white relative z-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <h2 className="text-4xl md:text-[56px] font-sans font-black text-gray-900 tracking-tighter leading-tight">
            Simple Steps, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-[#3377ff]">Premium Results</span>.
          </h2>
        </div>

        {/* Timeline wrapper */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">

          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[48px] left-[12%] right-[12%] h-[2px] border-t-[2px] border-dashed border-blue-200 z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center w-full md:w-1/4 mb-12 md:mb-0 group cursor-pointer"
              onClick={() => openModal(null, null, step.step)}
            >
              {/* Icon Circle */}
              <div className="w-[96px] h-[96px] rounded-full bg-white border-[1.5px] border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6 relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(0,82,204,0.15)] group-hover:border-blue-100">
                {step.icon}

                {/* Number Badge */}
                <div className="absolute -left-1 bottom-1 w-[30px] h-[30px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[14px] shadow-md border-2 border-white">
                  {step.step}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-[17px] font-extrabold text-[#0a192f] mb-2 text-center group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-[13px] text-gray-500 text-center max-w-[200px] leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
