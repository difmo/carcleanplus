import React from 'react';
import { FiZap, FiDroplet, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useBooking } from '../context/BookingContext';

const WaterElectricityPromoBanner = ({ compact = false }) => {
  const { openModal, updateBooking } = useBooking();

  const handleClaimOffer = () => {
    updateBooking('providesWaterElectricity', true);
    openModal();
  };

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm my-6">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-emerald-500/20">
            <FiZap />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Instant Discount</span>
            </div>
            <h4 className="text-gray-900 font-black text-sm sm:text-base leading-tight">
              Save ₹100 on Your Car Wash
            </h4>
            <p className="text-gray-600 text-xs mt-0.5 font-medium">
              Provide Water & Electricity at your doorstep & get an automatic <strong className="text-emerald-600 font-bold">₹100 OFF</strong> on checkout.
            </p>
          </div>
        </div>
        <button
          onClick={handleClaimOffer}
          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>Claim ₹100 OFF</span>
          <FiArrowRight />
        </button>
      </div>
    );
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1e42] via-[#0f2d6b] to-[#1D4ED8] p-8 sm:p-12 text-white shadow-2xl border border-blue-400/20">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-black uppercase tracking-wider mb-4 shadow-sm backdrop-blur-sm">
                <FiZap className="text-emerald-400 text-sm animate-pulse" />
                <span>Special Customer Offer</span>
              </div>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
                Save <span className="text-emerald-400 underline decoration-emerald-400/40 decoration-4">₹100</span> on Your Car Wash
              </h3>

              {/* Description */}
              <p className="text-blue-100 text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-6">
                Provide outdoor Water & Electricity at your parking or doorstep, and we'll automatically apply a flat <strong className="text-white font-extrabold">₹100 discount</strong> to your service bill.
              </p>

              {/* Benefits checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-blue-100 font-semibold mb-6 sm:mb-0">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FiCheckCircle className="text-emerald-400 shrink-0 text-base" />
                  <span>Instant ₹100 OFF calculated in checkout</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FiCheckCircle className="text-emerald-400 shrink-0 text-base" />
                  <span>Faster high-pressure cleaning turnaround</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FiCheckCircle className="text-emerald-400 shrink-0 text-base" />
                  <span>Applicable on Basic, Premium & Complete Clean</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <FiCheckCircle className="text-emerald-400 shrink-0 text-base" />
                  <span>Doorstep convenience across Lucknow</span>
                </div>
              </div>
            </div>

            {/* Call to action card */}
            <div className="w-full lg:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 rounded-2xl text-center flex flex-col items-center shadow-xl">
              <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Discount Coupon</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 tracking-tight mb-2">₹100 OFF</div>
              <div className="text-xs text-blue-100 font-medium mb-6 max-w-xs">
                Select "Yes" for Water & Electricity in booking flow to activate savings.
              </div>

              <button
                onClick={handleClaimOffer}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-base rounded-xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Book Now & Save ₹100</span>
                <FiArrowRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterElectricityPromoBanner;
