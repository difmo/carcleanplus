import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaGift, FaCheckCircle, FaCarSide } from 'react-icons/fa';

const OfferSection = () => {
  const { openModal } = useBooking();

  return (
    <div id="offer" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-amber-500 text-white rounded-full font-bold text-sm mb-6 shadow-lg">
              <FaGift className="animate-bounce" />
              <span className="tracking-widest">LIMITED TIME SPECIAL</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-heading leading-tight tracking-tight">
              Get the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-600">Ultimate Glow</span><br />For Your Car
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
              Book our Festive Offer package today and give your car the complete premium treatment it deserves, at an unbeatable price!
            </p>
            
            <ul className="space-y-4 mb-10 text-left max-w-md mx-auto md:mx-0">
              <li className="flex items-center text-gray-800 font-bold">
                <FaCheckCircle className="text-green-500 mr-3 text-2xl" />
                Complete Interior Deep Cleaning
              </li>
              <li className="flex items-center text-gray-800 font-bold">
                <FaCheckCircle className="text-green-500 mr-3 text-2xl" />
                Premium Exterior Wash & Polish
              </li>
              <li className="flex items-center text-gray-800 font-bold">
                <FaCheckCircle className="text-green-500 mr-3 text-2xl" />
                Engine Bay & AC Vent Sanitization
              </li>
            </ul>

            <button
              onClick={() => openModal()}
              className="px-10 py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black rounded-full text-lg shadow-[0_10px_25px_rgba(245,158,11,0.5)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
              Claim Offer Now - ₹899
            </button>
          </div>

          {/* Right Visual Content (The Package Card) */}
          <div className="flex-1 w-full max-w-md mx-auto relative mt-10 md:mt-0">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-amber-400 blur-[60px] opacity-20 rounded-[40px]"></div>
            
            <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(245,158,11,0.15)] border-[4px] border-amber-100 relative transform hover:-translate-y-2 transition-transform duration-500 z-10">
               {/* Discount Badge */}
               <div className="absolute -top-6 -right-4 md:-right-8 w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex flex-col items-center justify-center text-white font-black text-xl shadow-xl border-4 border-white rotate-12">
                 <span className="text-2xl leading-none">20%</span>
                 <span className="text-sm">OFF</span>
               </div>
               
               <div className="flex justify-center mb-6">
                 <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-50 rounded-full flex items-center justify-center shadow-inner">
                   <FaCarSide className="text-5xl text-amber-500 drop-shadow-md" />
                 </div>
               </div>
               <h3 className="text-3xl font-extrabold text-center text-gray-900 mb-2 font-heading">Festive Offer</h3>
               <div className="text-center mb-8">
                 <span className="text-gray-400 line-through text-xl mr-3 font-bold decoration-2">₹1199</span>
                 <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">₹899</span>
                 <p className="text-sm text-gray-500 mt-2 font-semibold">*Price starts for compact cars</p>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 flex items-start gap-4">
                   <div className="bg-white p-3 rounded-xl text-amber-600 shadow-sm mt-1">
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
