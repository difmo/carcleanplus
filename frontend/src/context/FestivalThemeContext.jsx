import React, { createContext, useContext, useState, useEffect } from 'react';

export const FESTIVALS = {
  DIWALI: {
    id: 'diwali',
    name: 'Diwali Special',
    greeting: '✨ Happy Diwali! Light up your ride with festive shine ✨',
    badgeText: 'DIWALI DHAMAKA SPECIAL',
    icon: '🪔',
    headline: 'Diwali Sparkle for Your Car',
    highlightText: 'Festive Glow',
    description: 'Celebrate the Festival of Lights with a showroom-like gleam! Deep interior cleaning & exterior diamond polish at special Diwali discounts.',
    features: [
      'Complete Deep Interior Cleaning',
      'Exterior Shyne-Polish & Diya-Glow Finish',
      'Engine Bay & AC Vent Sanitization'
    ],
    originalPrice: '1299',
    offerPrice: '899',
    discount: '30% OFF',
    themeColors: {
      primary: '#d97706',
      badgeGradient: 'from-amber-500 via-orange-500 to-red-600',
      sectionBg: 'from-amber-50 via-orange-50 to-amber-100/60',
      cardBorder: 'border-amber-200',
      buttonGradient: 'from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700',
      priceGradient: 'from-amber-600 to-red-600',
      bannerBg: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-700',
      accentGlow: 'bg-amber-400/25',
      badgeBg: 'bg-gradient-to-br from-amber-500 to-red-600',
    }
  },
  HOLI: {
    id: 'holi',
    name: 'Holi Special',
    greeting: '🎨 Happy Holi! Keep your car vibrant & stain-free 💦',
    badgeText: 'HOLI COLOR-SHIELD SPECIAL',
    icon: '🎨',
    headline: 'Celebrate Colors, Keep Your Car Clean',
    highlightText: 'Vibrant Shine',
    description: 'Special post-Holi stain removal and protective coating to safeguard your car’s paint and interior from colors & water damage!',
    features: [
      'Stain & Gulal Removal Detailing',
      'Hydrophobic Protective Exterior Wash',
      'Interior Sanitization & Upholstery Care'
    ],
    originalPrice: '1199',
    offerPrice: '799',
    discount: '35% OFF',
    themeColors: {
      primary: '#ec4899',
      badgeGradient: 'from-pink-500 via-purple-500 to-amber-400',
      sectionBg: 'from-pink-50 via-purple-50 to-amber-50',
      cardBorder: 'border-pink-200',
      buttonGradient: 'from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700',
      priceGradient: 'from-pink-600 to-purple-600',
      bannerBg: 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700',
      accentGlow: 'bg-pink-400/25',
      badgeBg: 'bg-gradient-to-br from-pink-500 to-purple-600',
    }
  },
  NAVRATRI: {
    id: 'navratri',
    name: 'Navratri / Dussehra',
    greeting: '🚩 Shubh Navratri! Auspicious shine for your vehicle 🪔',
    badgeText: 'SHUBH NAVRATRI SPECIAL',
    icon: '🚩',
    headline: 'Celebrate Navratri With A Pristine Ride',
    highlightText: 'Auspicious Shine',
    description: 'Welcome prosperity this festive season. Get your vehicle blessed with sparkling purity and divine polish.',
    features: [
      'Pure & Deep Interior Detailing',
      'Ceramic-Infused Exterior Wash & Shine',
      'Full Car Aromatherapy & AC Sanitization'
    ],
    originalPrice: '1199',
    offerPrice: '849',
    discount: '28% OFF',
    themeColors: {
      primary: '#ea580c',
      badgeGradient: 'from-orange-500 via-amber-500 to-red-500',
      sectionBg: 'from-orange-50 via-amber-50 to-yellow-50',
      cardBorder: 'border-orange-200',
      buttonGradient: 'from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
      priceGradient: 'from-orange-600 to-amber-600',
      bannerBg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-red-600',
      accentGlow: 'bg-orange-400/25',
      badgeBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
    }
  },
  EID: {
    id: 'eid',
    name: 'Eid Special',
    greeting: '🌙 Eid Mubarak! Premium doorstep care for your car ✨',
    badgeText: 'EID MUBARAK SPECIAL',
    icon: '🌙',
    headline: 'Step Out In Style This Festive Season',
    highlightText: 'Royal Clean',
    description: 'Celebrate Eid with a car that shines inside and out. Enjoy unmatched deep cleaning and freshness for family journeys.',
    features: [
      'Royal Velvet Interior Deep Vacuum',
      'Mirror Finish Wax & Tyre Dressing',
      'Eco-Friendly Sanitization & Fragrance'
    ],
    originalPrice: '1299',
    offerPrice: '899',
    discount: '30% OFF',
    themeColors: {
      primary: '#059669',
      badgeGradient: 'from-emerald-600 via-teal-500 to-amber-400',
      sectionBg: 'from-emerald-50 via-teal-50 to-slate-50',
      cardBorder: 'border-emerald-200',
      buttonGradient: 'from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800',
      priceGradient: 'from-emerald-700 to-teal-600',
      bannerBg: 'bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900',
      accentGlow: 'bg-emerald-400/25',
      badgeBg: 'bg-gradient-to-br from-emerald-600 to-teal-600',
    }
  },
  NEWYEAR: {
    id: 'newyear',
    name: 'New Year / Christmas',
    greeting: '🎉 Happy New Year! Start the year fresh with a sparkling clean car 🎄',
    badgeText: 'NEW YEAR MEGA OFFER',
    icon: '🎉',
    headline: 'Start The New Year Fresh & Sparkling',
    highlightText: 'Ultimate Glow',
    description: 'Welcome the new year with a shiny brand new feel! Book our full festive treatment package at an unbeatable price.',
    features: [
      'Complete Deep Interior Cleaning',
      'Winter-Shield Exterior Polish & Shine',
      'Engine Bay & AC Vent Sanitization'
    ],
    originalPrice: '1199',
    offerPrice: '899',
    discount: '25% OFF',
    themeColors: {
      primary: '#dc2626',
      badgeGradient: 'from-red-600 via-rose-600 to-amber-500',
      sectionBg: 'from-red-50 via-rose-50 to-orange-50',
      cardBorder: 'border-red-200',
      buttonGradient: 'from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800',
      priceGradient: 'from-red-600 to-rose-600',
      bannerBg: 'bg-gradient-to-r from-red-700 via-rose-700 to-amber-700',
      accentGlow: 'bg-red-400/25',
      badgeBg: 'bg-gradient-to-br from-red-600 to-rose-600',
    }
  },
  GENERAL: {
    id: 'general',
    name: 'General Festive',
    greeting: '🎁 Limited Time Special! Book now and get up to 20% OFF on all packages',
    badgeText: 'LIMITED TIME SPECIAL',
    icon: '🎁',
    headline: 'Get the Ultimate Glow For Your Car',
    highlightText: 'Ultimate Glow',
    description: 'Book our Festive Offer package today and give your car the complete premium treatment it deserves, at an unbeatable price!',
    features: [
      'Complete Interior Deep Cleaning',
      'Premium Exterior Wash & Polish',
      'Engine Bay & AC Vent Sanitization'
    ],
    originalPrice: '1199',
    offerPrice: '899',
    discount: '20% OFF',
    themeColors: {
      primary: '#d97706',
      badgeGradient: 'from-red-500 to-amber-500',
      sectionBg: 'from-amber-50 to-orange-50',
      cardBorder: 'border-amber-100',
      buttonGradient: 'from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600',
      priceGradient: 'from-red-600 to-amber-600',
      bannerBg: 'bg-gradient-to-r from-red-600 via-amber-600 to-orange-600',
      accentGlow: 'bg-amber-300/30',
      badgeBg: 'bg-gradient-to-br from-red-500 to-rose-600',
    }
  }
};

import { BASE_URL } from '../utils/api';

const FestivalThemeContext = createContext();

export const useFestivalTheme = () => useContext(FestivalThemeContext);

export const FestivalThemeProvider = ({ children }) => {
  const [activeFestivalKey, setActiveFestivalKey] = useState(() => {
    const saved = localStorage.getItem('carclean_active_festival');
    if (saved && FESTIVALS[saved]) return saved;
    return 'DIWALI';
  });

  const [isOfferActive, setIsOfferActive] = useState(true);
  const [customOfferPrice, setCustomOfferPrice] = useState('');
  const [customDiscount, setCustomDiscount] = useState('');

  // Fetch from server on load so all visitors see the Admin's chosen festival
  useEffect(() => {
    let isCurrent = true;
    fetch(`${BASE_URL}/api/festival`)
      .then(res => res.json())
      .then(data => {
        if (isCurrent && data.success && data.data) {
          if (data.data.activeFestival && FESTIVALS[data.data.activeFestival]) {
            setActiveFestivalKey(data.data.activeFestival);
            localStorage.setItem('carclean_active_festival', data.data.activeFestival);
          }
          if (typeof data.data.isOfferActive === 'boolean') {
            setIsOfferActive(data.data.isOfferActive);
          }
          if (data.data.customOfferPrice) {
            setCustomOfferPrice(data.data.customOfferPrice);
          }
          if (data.data.customDiscount) {
            setCustomDiscount(data.data.customDiscount);
          }
        }
      })
      .catch(err => {
        console.error('Error fetching live festival setting:', err);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const setFestival = async (key) => {
    if (!FESTIVALS[key]) return;
    setActiveFestivalKey(key);
    localStorage.setItem('carclean_active_festival', key);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${BASE_URL}/api/festival`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ activeFestival: key }),
        });
      } catch (err) {
        console.error('Error saving festival to server:', err);
      }
    }
  };

  const saveFestivalSettings = async (settings) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, message: 'Admin not logged in' };
    try {
      const res = await fetch(`${BASE_URL}/api/festival`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        if (settings.activeFestival && FESTIVALS[settings.activeFestival]) {
          setActiveFestivalKey(settings.activeFestival);
          localStorage.setItem('carclean_active_festival', settings.activeFestival);
        }
        if (typeof settings.isOfferActive === 'boolean') {
          setIsOfferActive(settings.isOfferActive);
        }
        if (settings.customOfferPrice !== undefined) {
          setCustomOfferPrice(settings.customOfferPrice);
        }
        if (settings.customDiscount !== undefined) {
          setCustomDiscount(settings.customDiscount);
        }
      }
      return data;
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection error' };
    }
  };

  const baseTheme = FESTIVALS[activeFestivalKey] || FESTIVALS.DIWALI;
  const currentTheme = {
    ...baseTheme,
    offerPrice: customOfferPrice || baseTheme.offerPrice,
    discount: customDiscount || baseTheme.discount,
  };

  return (
    <FestivalThemeContext.Provider
      value={{
        festivals: FESTIVALS,
        activeFestivalKey,
        currentTheme,
        isOfferActive,
        customOfferPrice,
        customDiscount,
        setFestival,
        saveFestivalSettings,
      }}
    >
      {children}
    </FestivalThemeContext.Provider>
  );
};

export default FestivalThemeContext;
