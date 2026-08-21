import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { FaArrowRight, FaCheck, FaCarSide, FaRegClock } from 'react-icons/fa';

const ServicesPricing = () => {
  const { openModal } = useBooking();
  const navigate = useNavigate();

  const packages = [
    {
      id: 'basic',
      name: 'Basic Wash',
      price: '299',
      desc: 'Exterior cleaning to make your car shine and look fresh.',
      icon: <FaCarSide className="text-4xl text-primary" />,
      features: [
        'Exterior Wash',
        'Wheel Cleaning',
        'Tyre Shine',
        'Drying',
      ],
      time: '30 - 40 mins',
      popular: false,
      bgColor: 'bg-white',
      borderColor: 'border-gray-100',
    },
    {
      id: 'premium',
      name: 'Premium Wash',
      price: '499',
      desc: 'Complete care for exterior + interior for a fresh drive.',
      icon: <FaCarSide className="text-4xl text-[#0052cc]" />,
      features: [
        'Everything in Basic',
        'Interior Vacuum',
        'Dashboard Cleaning',
        'Tyre & Rim Shine',
      ],
      time: '45 - 60 mins',
      popular: true,
      bgColor: 'bg-gradient-to-b from-[#f8faff] to-white',
      borderColor: 'border-2 border-[#0052cc]',
    },
    {
      id: 'complete',
      name: 'Complete Clean',
      price: '699',
      desc: 'Deep cleaning for a like-new experience.',
      icon: <FaCarSide className="text-4xl text-[#0052cc]" />,
      features: [
        'Everything in Premium',
        'Deep Interior Cleaning',
        'Seat & Mat Cleaning',
        'Interior Detailing',
      ],
      time: '60 - 90 mins',
      popular: false,
      bgColor: 'bg-white',
      borderColor: 'border-gray-100',
    }
  ];

  return (
    <section id="services" className="pt-10 pb-20 bg-white relative z-10 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl md:text-[52px] font-sans font-black text-gray-900 mb-4 tracking-tighter leading-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-[#3377ff]">Wash</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1150px] mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-[20px] transition-all duration-300 ease-out flex flex-col border-[1.5px] p-6 lg:p-8 hover:-translate-y-2 hover:shadow-2xl ${pkg.bgColor} ${pkg.borderColor} ${
                pkg.popular ? 'shadow-[0_10px_40px_-10px_rgba(0,82,204,0.3)] md:-translate-y-2 hover:md:-translate-y-4' : 'shadow-md'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0052cc] to-[#3377ff] text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.15em] rounded-full shadow-lg z-10 whitespace-nowrap border border-[#0052cc]/20">
                  Most Popular
                </div>
              )}

              {/* Header: Icon & Title */}
              <div className="flex gap-3 items-start mb-4">
                <div className="flex-shrink-0 mt-1">
                  {pkg.icon}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-[17px] md:text-lg font-extrabold text-gray-900 leading-none">{pkg.name}</h3>
                    <span className="bg-primary text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      From ₹{pkg.price}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-snug font-medium pr-1">
                    {pkg.desc}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <ul className="text-left space-y-2 mb-6 flex-grow">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[13px] text-gray-700 font-medium">
                    <FaCheck className="text-primary mr-2.5 flex-shrink-0 text-[10px]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Time Estimate */}
              <div className="flex items-center gap-2 text-gray-900 font-bold text-[13px] pt-4 border-t border-gray-200/80 mb-5">
                <FaRegClock className="text-gray-500 text-base" />
                <span>{pkg.time}</span>
              </div>

              {/* Book Now Button */}
              <div className="mt-auto pt-2">
                <button
                  onClick={() => openModal(null, pkg.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 transform active:scale-95 border-2 ${
                    pkg.popular
                      ? 'bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark shadow-[0_4px_14px_0_rgba(0,82,204,0.3)] hover:shadow-[0_6px_20px_rgba(0,82,204,0.5)] hover:-translate-y-1'
                      : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_6px_20px_rgba(0,82,204,0.4)] hover:-translate-y-1'
                  }`}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex justify-center flex-col items-center gap-4">
          <button
            onClick={() => navigate('/pricing')}
            className="group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_-10px_rgba(0,82,204,0.7)]"
          >
            <span className="relative z-10 tracking-widest uppercase text-xs font-extrabold">View All Packages</span>
            <FaArrowRight className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300 text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPricing;
