import React from 'react';
import { useBooking } from '../context/BookingContext';
import { useFestivalTheme } from '../context/FestivalThemeContext';
import { FaCheckCircle, FaCarSide } from 'react-icons/fa';

const OfferSection = () => {
  const { openModal } = useBooking();
  const { currentTheme } = useFestivalTheme();
  const { themeColors } = currentTheme;

  return (
    <div id="offer" className={`py-20 bg-gradient-to-br ${themeColors.sectionBg} relative overflow-hidden transition-colors duration-700`}>
      {/* Decorative background ambient glows */}
      <div className={`absolute top-0 right-0 w-80 h-80 ${themeColors.accentGlow} rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none transition-all duration-700`}></div>
      <div className={`absolute bottom-0 left-0 w-96 h-96 ${themeColors.accentGlow} rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none transition-all duration-700`}></div>

      {/* Floating festival motifs */}
      <div className="absolute top-10 left-[8%] text-3xl opacity-30 animate-pulse pointer-events-none select-none">
        {currentTheme.icon}
      </div>
      <div className="absolute bottom-12 right-[10%] text-4xl opacity-25 animate-bounce pointer-events-none select-none" style={{ animationDuration: '3s' }}>
        {currentTheme.icon}
      </div>
      <div className="absolute top-1/2 right-[4%] text-2xl opacity-20 pointer-events-none select-none">
        ✨
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${themeColors.badgeGradient} text-white rounded-full font-bold text-xs sm:text-sm mb-6 shadow-lg tracking-wider uppercase transition-all duration-500`}>
              <span className="text-base animate-spin" style={{ animationDuration: '8s' }}>{currentTheme.icon}</span>
              <span>{currentTheme.badgeText}</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-heading leading-tight tracking-tight">
              Get the <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.priceGradient}`}>{currentTheme.highlightText}</span><br />For Your Car
            </h2>

            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              {currentTheme.description}
            </p>
            
            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto md:mx-0">
              {currentTheme.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-800 font-bold text-[15px]">
                  <FaCheckCircle className="text-green-500 mr-3 text-2xl shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openModal(null, 'Festive Offer')}
              className={`px-10 py-4 bg-gradient-to-r ${themeColors.buttonGradient} text-white font-black rounded-full text-lg shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2.5 mx-auto md:mx-0`}
            >
              <span>Claim {currentTheme.name} - ₹{currentTheme.offerPrice}</span>
              <span>{currentTheme.icon}</span>
            </button>
          </div>

          {/* Right Visual Content (The Package Card) */}
          <div className="flex-1 w-full max-w-md mx-auto relative mt-10 md:mt-0">
            <div className={`bg-white p-8 md:p-10 rounded-[40px] border-[3px] ${themeColors.cardBorder} shadow-2xl relative transform hover:-translate-y-2 transition-all duration-500 z-10`}>
               {/* Discount Badge */}
               <div className={`absolute -top-6 -right-4 md:-right-6 w-24 h-24 ${themeColors.badgeBg} rounded-full flex flex-col items-center justify-center text-white font-black text-xl border-4 border-white shadow-lg rotate-12`}>
                 <span className="text-2xl leading-none">{currentTheme.discount.split(' ')[0]}</span>
                 <span className="text-xs font-bold uppercase tracking-wider">OFF</span>
               </div>
               
               <div className="flex justify-center mb-6">
                 <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-full flex items-center justify-center shadow-inner relative">
                   <span className="absolute -top-1 -right-1 text-2xl">{currentTheme.icon}</span>
                   <FaCarSide className="text-5xl text-amber-500" />
                 </div>
               </div>
               <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2 font-heading">{currentTheme.name}</h3>
               <div className="text-center mb-8">
                 <span className="text-gray-400 line-through text-xl mr-3 font-bold decoration-2">₹{currentTheme.originalPrice}</span>
                 <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${themeColors.priceGradient}`}>₹{currentTheme.offerPrice}</span>
                 <p className="text-sm text-gray-500 mt-2 font-semibold">*Price starts for compact cars</p>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-gradient-to-r from-gray-50 to-amber-50/50 p-5 rounded-2xl border border-gray-100 flex items-start gap-4">
                   <div className="bg-white p-3 rounded-xl text-amber-600 mt-1 shadow-sm">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <div>
                     <h4 className="font-extrabold text-gray-900 text-lg">Takes 90-120 Mins</h4>
                     <p className="text-sm text-gray-600 font-medium">Detailed and thorough cleaning by our top experts.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
