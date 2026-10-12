import React, { useState } from 'react';
import { FiCheck, FiCalendar, FiClock, FiShield, FiStar, FiArrowRight, FiZap } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { useBooking } from '../context/BookingContext';
import { CAR_CATEGORIES } from '../utils/pricingLogic';

const MEMBERSHIP_PRICING = {
  [CAR_CATEGORIES.COMPACT]: {
    label: 'Compact / Hatchback',
    sublabel: 'Swift, i10, Tiago, WagonR, Baleno',
    plans: {
      twoWash: {
        price: 549,
        originalPrice: 598,
        perWash: 275,
        savePercent: '10% OFF'
      },
      fourWash: {
        price: 999,
        originalPrice: 1196,
        perWash: 250,
        savePercent: '18% OFF'
      }
    }
  },
  [CAR_CATEGORIES.STANDARD]: {
    label: 'Standard / Sedan',
    sublabel: 'Dzire, City, Verna, Creta, Brezza, Nexon',
    plans: {
      twoWash: {
        price: 699,
        originalPrice: 798,
        perWash: 350,
        savePercent: '12% OFF'
      },
      fourWash: {
        price: 1299,
        originalPrice: 1596,
        perWash: 325,
        savePercent: '20% OFF'
      }
    }
  },
  [CAR_CATEGORIES.LARGE]: {
    label: 'Large / SUV / Luxury',
    sublabel: 'Harrier, XUV700, Fortuner, Safari, Scorpio-N',
    plans: {
      twoWash: {
        price: 899,
        originalPrice: 998,
        perWash: 450,
        savePercent: '10% OFF'
      },
      fourWash: {
        price: 1599,
        originalPrice: 1996,
        perWash: 400,
        savePercent: '22% OFF'
      }
    }
  }
};

const MonthlyMembership = () => {
  const [selectedCategory, setSelectedCategory] = useState(CAR_CATEGORIES.STANDARD);
  const { openModal, updateBooking } = useBooking();

  const currentPricing = MEMBERSHIP_PRICING[selectedCategory] || MEMBERSHIP_PRICING[CAR_CATEGORIES.STANDARD];

  const handleSelectPlan = (planKey, planName, price) => {
    // Populate booking state with membership plan and trigger modal
    updateBooking('service', `Monthly Plan: ${planName}`);
    updateBooking('finalPrice', price);
    updateBooking('servicePrice', price);
    updateBooking('discount', 0);
    openModal();
  };

  return (
    <section id="memberships" className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden font-sans">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#1D4ED8] text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
            <HiOutlineSparkles className="text-base text-amber-500" />
            <span>Monthly Wash Subscriptions</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Keep Your Car Clean <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6]">All Month Long</span>
          </h2>
          
          <p className="text-gray-600 text-sm sm:text-base font-medium leading-relaxed">
            Choose a recurring care plan with scheduled doorstep visits, guaranteed time slots, and priority washers. Cancel or pause anytime.
          </p>

          {/* Membership Flow Indicator (Client Point 3) */}
          <div className="mt-8 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-gray-700">
            <span className="flex items-center gap-1.5 text-[#1D4ED8] font-black">
              <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-[10px]">1</span> Select Car
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1.5 text-[#1D4ED8] font-black">
              <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center text-[10px]">2</span> Select Plan
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">3</span> Location
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1.5 text-gray-600">
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-[10px]">4</span> Start Date
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-black">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">5</span> Activated!
            </span>
          </div>

          {/* Step 1: Car Category Selector */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl max-w-lg mx-auto">
            {Object.keys(MEMBERSHIP_PRICING).map(catKey => {
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    isSelected
                      ? 'bg-white text-[#1D4ED8] shadow-sm border border-gray-200/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {catKey}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2 font-semibold">
            Examples: {currentPricing.sublabel}
          </p>
        </div>

        {/* Plans Grid (2 Washes / Month vs 4 Washes / Month) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Plan 1: 2 Wash / Month */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col relative group">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1D4ED8] text-xs font-black uppercase tracking-wider">
                <FiCalendar className="text-xs" />
                <span>Bi-Weekly Care</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {currentPricing.plans.twoWash.savePercent}
              </span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              2 Washes / Month
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-6">
              2 scheduled car washes per month (Every 14 days)
            </p>

            {/* Price Box */}
            <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  ₹{currentPricing.plans.twoWash.price}
                </span>
                <span className="text-xs font-bold text-gray-500 ml-1">/ month</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through block">₹{currentPricing.plans.twoWash.originalPrice}</span>
                <span className="text-[11px] font-black text-[#1D4ED8]">₹{currentPricing.plans.twoWash.perWash} per wash</span>
              </div>
            </div>

            {/* Benefits Checklist */}
            <ul className="space-y-3 mb-8 text-xs sm:text-sm text-gray-700 font-semibold flex-1">
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>2 Exterior Foam Washes</strong> + Rim cleaning</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>2 Interior Vacuuming</strong> & Mat cleaning</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span>Dashboard & console wipe down</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span>Flexible rescheduling (choose your dates)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span>Valid for 30 days from start date</span>
              </li>
            </ul>

            <button
              onClick={() => handleSelectPlan('twoWash', `2 Washes / Month (${selectedCategory})`, currentPricing.plans.twoWash.price)}
              className="w-full py-4 px-6 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Subscribe 2-Wash Plan</span>
              <FiArrowRight className="text-base" />
            </button>
          </div>

          {/* Plan 2: 4 Wash / Month (Popular) */}
          <div className="bg-gradient-to-b from-[#f8faff] via-white to-white rounded-3xl p-8 border-2 border-[#1D4ED8] shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative group">
            {/* Top Popular Ribbon */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-md flex items-center gap-1.5">
              <FiStar className="text-amber-300" /> Most Popular
            </div>

            <div className="flex items-center justify-between mb-4 mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-[#1D4ED8] text-xs font-black uppercase tracking-wider">
                <FiCalendar className="text-xs" />
                <span>Weekly Complete Care</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {currentPricing.plans.fourWash.savePercent}
              </span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
              4 Washes / Month
            </h3>
            <p className="text-xs text-gray-500 font-semibold mb-6">
              4 scheduled car washes per month (1 wash every week)
            </p>

            {/* Price Box */}
            <div className="mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-[#1D4ED8] tracking-tight">
                  ₹{currentPricing.plans.fourWash.price}
                </span>
                <span className="text-xs font-bold text-gray-500 ml-1">/ month</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through block">₹{currentPricing.plans.fourWash.originalPrice}</span>
                <span className="text-[11px] font-black text-emerald-600">₹{currentPricing.plans.fourWash.perWash} per wash</span>
              </div>
            </div>

            {/* Benefits Checklist */}
            <ul className="space-y-3 mb-8 text-xs sm:text-sm text-gray-700 font-semibold flex-1">
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>4 Full Exterior Foam Washes</strong> (Weekly)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>4 Deep Interior Vacuumings</strong> & Foot mat washes</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>Complimentary Tyre & Rim Dressing</strong> on every visit</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span><strong>Free Carnauba Liquid Wax Top-Up</strong> (1x/month)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span>Dedicated professional washer assigned</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiCheck className="text-emerald-500 text-base shrink-0" />
                <span>Guaranteed priority slot booking</span>
              </li>
            </ul>

            <button
              onClick={() => handleSelectPlan('fourWash', `4 Washes / Month (${selectedCategory})`, currentPricing.plans.fourWash.price)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#3b82f6] hover:from-blue-700 hover:to-blue-600 text-white font-black text-sm transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Subscribe 4-Wash Plan</span>
              <FiArrowRight className="text-base" />
            </button>
          </div>

        </div>

        {/* Footer Guarantee Badge */}
        <div className="mt-14 max-w-2xl mx-auto p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FiShield />
          </div>
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
              100% Satisfaction & Flexibility Guarantee
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Unused washes carry forward or can be rescheduled with 2 hours' notice. Cancel anytime with zero lock-in fee.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MonthlyMembership;
