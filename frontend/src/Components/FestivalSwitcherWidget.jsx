import React, { useState, useEffect, useRef } from 'react';
import { useFestivalTheme } from '../context/FestivalThemeContext';
import { FaCheck, FaTimes, FaChevronUp, FaChevronDown, FaTag } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const FestivalSwitcherWidget = () => {
  const { festivals, activeFestivalKey, setFestival, currentTheme } = useFestivalTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    const checkRole = () => {
      try {
        const u = localStorage.getItem('user');
        if (u) {
          const parsed = JSON.parse(u);
          setIsAdmin(parsed.role === 'admin' || parsed.role === 'superadmin');
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        setIsAdmin(false);
      }
    };
    checkRole();
    window.addEventListener('storage', checkRole);
    return () => window.removeEventListener('storage', checkRole);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isAdmin) return null;

  const getFestivalGlow = (key) => {
    switch (key) {
      case 'DIWALI':
        return 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400';
      case 'HOLI':
        return 'from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-400';
      case 'NAVRATRI':
        return 'from-orange-500/20 to-yellow-500/20 border-orange-500/40 text-orange-400';
      case 'EID':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400';
      case 'NEWYEAR':
        return 'from-red-500/20 to-rose-500/20 border-red-500/40 text-rose-400';
      default:
        return 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-400';
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {/* Luxury Theme Selector Drawer */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[330px] sm:w-[350px] bg-[#0c1222]/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/15 p-4 mb-2 animate-fade-in text-white overflow-hidden ring-1 ring-white/10">
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Drawer Header */}
          <div className="relative flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                <HiSparkles className="text-base animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-[14px] text-white tracking-tight leading-tight">
                  Festival Themes
                </h3>
                <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                  Live atmosphere, colors & offers
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>

          {/* Festival Options List */}
          <div className="relative space-y-2 mt-3 max-h-[310px] overflow-y-auto pr-1 custom-scrollbar">
            {Object.keys(festivals).map((key) => {
              const f = festivals[key];
              const isSelected = activeFestivalKey === key;
              const glowClass = getFestivalGlow(key);

              return (
                <div
                  key={key}
                  onClick={() => {
                    setFestival(key);
                    setIsOpen(false);
                  }}
                  className={`group relative p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center justify-between ${
                    isSelected
                      ? `bg-gradient-to-r ${glowClass} shadow-lg ring-1 ring-white/20 scale-[1.01]`
                      : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/5 hover:border-white/20 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md ${
                        isSelected
                          ? 'bg-white/20 border border-white/30 backdrop-blur-md'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {f.icon}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-[13px] tracking-tight truncate ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                          {f.name}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <FaTag className="text-[8px]" /> {f.discount}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">
                          ₹{f.offerPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-white text-gray-950 flex items-center justify-center text-[10px] font-black shadow-md flex-shrink-0">
                      <FaCheck />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-gray-400">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Drawer Footer Status */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {currentTheme.name} Active
            </span>
            <span className="text-gray-500 text-[10px]">
              Tap any festival to apply
            </span>
          </div>
        </div>
      )}

      {/* Floating Ultra-Premium Capsule Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 pl-2 pr-4 py-2 bg-gradient-to-r from-[#0d1424] via-[#121c33] to-[#0d1424] hover:from-[#131d36] hover:to-[#131d36] text-white rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.2)] border border-amber-400/40 hover:border-amber-300 transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer backdrop-blur-xl ring-1 ring-white/10"
        title="Switch Festival Theme"
      >
        {/* Animated Background Shimmer Line */}
        <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shimmer" />
        </span>

        {/* Floating Glowing Festive Icon Orb */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-lg shadow-md shadow-amber-500/40 relative flex-shrink-0 border border-amber-200/40 group-hover:rotate-12 transition-transform duration-300">
          <span className="animate-pulse leading-none">{currentTheme.icon}</span>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 border border-gray-900"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-[0.18em] font-extrabold text-amber-300/90 leading-none">
            Festival Theme
          </span>
          <span className="text-[13px] font-black text-white tracking-tight leading-tight mt-0.5 group-hover:text-amber-200 transition-colors">
            {currentTheme.name}
          </span>
        </div>

        {/* Sparkles Action Icon */}
        <div className="flex items-center text-amber-400 text-xs pl-1">
          {isOpen ? (
            <FaChevronDown className="transition-transform duration-200" />
          ) : (
            <HiSparkles className="text-sm group-hover:rotate-45 transition-transform duration-300 text-amber-300 animate-pulse" />
          )}
        </div>
      </button>

      {/* Embedded CSS for smooth scroll and shimmer */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(200%);
          }
        }
        .group:hover .group-hover\\:animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default FestivalSwitcherWidget;
