import React from 'react';
import { FiArrowRight, FiCheck, FiClock, FiDroplet } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { SERVICES } from '../utils/pricingLogic';
import basicWash from '../assets/basic wash.png';
import interiorImg from '../assets/Interior Cleaning.png';
import completeImg from '../assets/Complete Detailing.png';

const ServicesPricing = () => {
  const { openModal } = useBooking();
  const navigate = useNavigate();

  const packages = [
    {
      id: SERVICES.BASIC,
      name: 'Basic Wash',
      price: '299',
      desc: 'Basic = Outside',
      image: basicWash,
      icon: <FiDroplet />,
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
      id: SERVICES.PREMIUM,
      name: 'Premium Wash',
      price: '499',
      desc: 'Premium = Outside + Inside',
      image: interiorImg,
      icon: <FiDroplet />,
      features: [
        'Everything in Basic Plus',
        'Interior Vacuum',
        'Dashboard Cleaning',
        'Mat Cleaning',
        'Tyre & Rim Shine',
      ],
      time: '45 - 60 mins',
      popular: true,
      bgColor: 'bg-gradient-to-b from-[#f8faff] to-white',
      borderColor: 'border-2 border-[#1D4ED8]',
    },
    {
      id: SERVICES.COMPLETE,
      name: 'Complete Clean',
      price: '699',
      desc: 'Complete = Full Deep Clean',
      image: completeImg,
      icon: <FiDroplet />,
      features: [
        'Everything in Premium',
        'Deep Interior Cleaning',
        'Seat & Mat Cleaning',
        'Interior Detailing',
        'Air Freshener',
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
          <h2 className="text-4xl md:text-[52px] font-sans font-black text-gray-900 mb-3 tracking-tighter leading-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] to-[#3377ff]">Wash</span>
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full text-xs font-black text-emerald-800 shadow-sm mb-4">
            <span className="text-emerald-600 font-extrabold">⚡ ₹100 OFF</span>
            <span className="text-gray-600 font-semibold">— Provide Water & Electricity & get an automatic ₹100 discount!</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1150px] mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all duration-300 ease-out flex flex-col border-[1.5px] p-6 lg:p-8 hover:-translate-y-2 ${pkg.bgColor} ${pkg.borderColor} ${
                pkg.popular ? 'md:-translate-y-2 hover:md:-translate-y-4' : ''
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1D4ED8] to-[#3377ff] text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.15em] rounded-full z-10 whitespace-nowrap border border-[#1D4ED8]/20">
                  Most Popular
                </div>
              )}

              <div className="photo-frame h-40 mb-4">
                <img src={pkg.image} alt={pkg.name} />
              </div>

              {/* Header: Icon & Title */}
              <div className="flex gap-3 items-start mb-3">
                <span className="icon-circle">{pkg.icon}</span>
                <div className="flex flex-col text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-[17px] md:text-lg font-extrabold text-gray-900 leading-none">{pkg.name}</h3>
                    <span className="bg-primary text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      From ₹{pkg.price}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600 leading-snug font-medium pr-1 mb-1">
                    {pkg.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-black tracking-wide w-fit">
                    <span>⚡ ₹100 OFF with Water & Electricity</span>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="text-left space-y-2 mb-6 flex-grow">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-[13px] text-gray-700 font-medium">
                    <FiCheck className="text-primary mr-2.5 flex-shrink-0 text-[10px]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Time Estimate */}
              <div className="flex items-center gap-2 text-gray-900 font-bold text-[13px] pt-4 border-t border-gray-200/80 mb-5">
                <FiClock className="text-gray-500 text-base" />
                <span>{pkg.time}</span>
              </div>

              {/* Book Now Button */}
              <div className="mt-auto pt-2">
                <button
                  onClick={() => openModal(null, pkg.id)}
                  className={`w-full min-h-[44px] py-3 rounded-full font-bold text-sm transition-all duration-300 transform active:scale-95 border-2 ${
                    pkg.popular
                      ? 'bg-primary border-primary text-white hover:bg-primary-dark hover:border-primary-dark hover:-translate-y-1'
                      : 'bg-transparent border-primary text-primary hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1'
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
            className="group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-8 rounded-full overflow-hidden transition-all duration-300"
          >
            <span className="relative z-10 tracking-widest uppercase text-xs font-extrabold">View All Packages</span>
            <FiArrowRight className="relative z-10 transform group-hover:translate-x-1 transition-transform duration-300 text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPricing;
