import React from 'react';
import { FiCalendar, FiMapPin, FiThumbsUp } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useBooking } from '../context/BookingContext';
import bookImg from '../assets/landing.jpg';
import arriveImg from '../assets/car.jpg';
import cleanImg from '../assets/wash car.png';
import enjoyImg from '../assets/home section.png';

const HowItWorks = () => {
  const { openModal } = useBooking();

  const steps = [
    {
      title: 'Book Your Service',
      description: 'Choose your service and book easily online.',
      step: 1,
      icon: <FiCalendar />,
      image: bookImg,
    },
    {
      title: 'We Arrive On Time',
      description: 'Our experts reach your location on time.',
      step: 2,
      icon: <FiMapPin />,
      image: arriveImg,
    },
    {
      title: 'Premium Cleaning',
      description: 'We clean your car with care and precision.',
      step: 3,
      icon: <HiOutlineSparkles />,
      image: cleanImg,
    },
    {
      title: 'You Relax & Enjoy',
      description: 'Sit back and enjoy your brand new car!',
      step: 4,
      icon: <FiThumbsUp />,
      image: enjoyImg,
    }
  ];

  return (
    <section id="process" className="pt-16 pb-20 bg-white relative z-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-sans font-black text-[#111827] tracking-tight leading-tight">
            Simple Steps, <span className="text-[#1D4ED8]">Premium Results</span>.
          </h2>
          <p className="mt-3 max-w-xl text-[#6B7280] text-sm md:text-base">
            Four doorstep steps, from the booking tap to a car that looks new.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <button
              key={step.step}
              type="button"
              className="text-left bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 transition-transform min-h-[40px]"
              onClick={() => openModal(null, null, step.step)}
            >
              <div className="photo-frame h-40">
                <img src={step.image} alt={step.title} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="icon-circle">{step.icon}</span>
                  <span className="text-xs font-bold text-[#1D4ED8]">Step {step.step}</span>
                </div>
                <h3 className="text-base font-extrabold text-[#111827] mb-1">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
