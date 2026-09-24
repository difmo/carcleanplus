import React, { useEffect } from 'react';
import { FaCarSide, FaCheck, FaRegClock, FaShieldAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { useBooking } from '../../context/BookingContext';
import { SERVICES } from '../../utils/pricingLogic';

const PricingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { openModal } = useBooking();

  const packages = [
    {
      id: SERVICES.BASIC,
      name: 'Basic Wash',
      price: '299',
      desc: 'Exterior Foam Wash & Quick Shine',
      features: [
        'High-Pressure Exterior Foam Wash',
        'Alloy Wheel & Rim Cleaning',
        'Tyre Dressing & Long-Lasting Shine',
        'Scratch-Free Microfiber Hand Drying',
        'Exterior Glass & Mirror Wipe'
      ],
      time: '30 - 40 mins',
      popular: false,
      accentColor: 'border-gray-200'
    },
    {
      id: SERVICES.PREMIUM,
      name: 'Premium Wash',
      price: '499',
      desc: 'Complete Inside + Outside Clean',
      features: [
        'Everything in Basic Wash',
        'Deep High-Power Interior Vacuum',
        'Dashboard & Console Dressing',
        'Foot Mat Deep Scrubbing & Wash',
        'Door Panels & Boot Vacuuming',
        'UV Protectant Conditioning'
      ],
      time: '45 - 60 mins',
      popular: true,
      accentColor: 'border-[#0052cc]'
    },
    {
      id: SERVICES.COMPLETE,
      name: 'Complete Clean',
      price: '699',
      desc: 'Deep Interior Spa & Exterior Wax',
      features: [
        'Everything in Premium Wash',
        'Seat Upholstery Foam Shampoo',
        'Roof Liner & Carpet Dry Clean',
        'AC Vent Sanitization & Steam Spray',
        'High-Gloss Liquid Carnauba Wax',
        'Premium Long-Lasting Aroma Spray'
      ],
      time: '60 - 90 mins',
      popular: false,
      accentColor: 'border-gray-200'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50/40 via-white to-gray-50 min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 relative overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-100/60 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#0052cc] text-xs font-black uppercase tracking-wider mb-3">
            <HiSparkles className="text-xs" />
            <span>Honest & Transparent Rates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Doorstep Wash <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-blue-600">Packages</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl mx-auto font-medium">
            Professional doorstep car detailing in Lucknow with zero hidden fees. Book online in 60 seconds.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl p-6 sm:p-7 flex flex-col border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                pkg.popular 
                  ? 'border-[#0052cc] shadow-lg shadow-blue-500/10' 
                  : 'border-gray-200/80 shadow-xs'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0052cc] text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest rounded-full shadow-md whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {/* Package Title & Price */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-gray-900">{pkg.name}</h3>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0052cc]">
                    <FaCarSide className="text-lg" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-3">{pkg.desc}</p>
                
                <div className="flex items-baseline gap-1 pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400">Starting from</span>
                  <span className="text-3xl font-black text-gray-900 tracking-tight">₹{pkg.price}</span>
                </div>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-2 rounded-xl mb-5">
                <FaRegClock className="text-[#0052cc]" />
                <span>Service Duration: {pkg.time}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 mb-7 flex-1 text-left">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start text-xs font-medium text-gray-700 gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <FaCheck className="text-[9px]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Book Button */}
              <button
                type="button"
                onClick={() => openModal(null, pkg.id)}
                className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer ${
                  pkg.popular
                    ? 'bg-[#0052cc] hover:bg-[#003380] text-white shadow-blue-500/25 hover:shadow-lg'
                    : 'bg-gray-900 hover:bg-black text-white hover:shadow-lg'
                }`}
              >
                Book {pkg.name}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-900 to-[#0052cc] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-white text-2xl">
              <FaShieldAlt />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tight">100% Satisfaction Guarantee</h4>
              <p className="text-blue-100 text-xs mt-1">If you're not completely satisfied with our wash, we'll re-clean it for free.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openModal()}
            className="px-6 py-3 bg-white text-[#0052cc] font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-blue-50 transition-all shadow-md shrink-0 cursor-pointer"
          >
            Custom Quote
          </button>
        </div>

      </div>
    </div>
  );
};

export default PricingPage;
