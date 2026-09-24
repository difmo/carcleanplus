import React, { useState } from 'react';
import { useFestivalTheme } from '../../../context/FestivalThemeContext';
import { FaCheckCircle, FaSave, FaEye, FaGift, FaTag } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const AdminFestivals = () => {
  const {
    festivals,
    activeFestivalKey,
    currentTheme,
    isOfferActive,
    customOfferPrice,
    customDiscount,
    saveFestivalSettings
  } = useFestivalTheme();

  const [selectedFestival, setSelectedFestival] = useState(activeFestivalKey);
  const [offerActive, setOfferActive] = useState(isOfferActive);
  const [priceInput, setPriceInput] = useState(customOfferPrice || '');
  const [discountInput, setDiscountInput] = useState(customDiscount || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  const handleSave = async (festivalToSave = selectedFestival) => {
    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });

    const result = await saveFestivalSettings({
      activeFestival: festivalToSave,
      isOfferActive: offerActive,
      customOfferPrice: priceInput.trim(),
      customDiscount: discountInput.trim(),
    });

    setIsSaving(false);
    if (result.success) {
      setSelectedFestival(festivalToSave);
      setSaveMessage({
        text: `Success! ${festivals[festivalToSave]?.name || festivalToSave} is now LIVE on the website for all visitors.`,
        type: 'success',
      });
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 5000);
    } else {
      setSaveMessage({
        text: result.message || 'Error updating festival settings',
        type: 'error',
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{currentTheme.icon}</span>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Festival Offers & Theme Manager
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Control which festival theme, colors, banner & offer discounts appear live on the website.
          </p>
        </div>

        <a
          href="/#offer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all shadow-sm w-fit"
        >
          <FaEye />
          <span>View Public Offer Section</span>
        </a>
      </div>

      {/* Feedback Alert */}
      {saveMessage.text && (
        <div
          className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 animate-fade-in ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <FaCheckCircle className="text-lg flex-shrink-0" />
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Theme Cards & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Festival Themes Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">
              Select Festival Atmosphere
            </h2>
            <span className="text-xs text-gray-400 font-bold">
              Current Live: <span className="text-[#0052cc]">{currentTheme.name}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(festivals).map((key) => {
              const f = festivals[key];
              const isCurrentLive = activeFestivalKey === key;
              const isCardSelected = selectedFestival === key;

              return (
                <div
                  key={key}
                  onClick={() => setSelectedFestival(key)}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isCardSelected
                      ? 'border-[#0052cc] bg-blue-50/40 shadow-md ring-2 ring-[#0052cc]/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Status Badge */}
                  {isCurrentLive && (
                    <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                      Active Live
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-inner">
                        {f.icon}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                          {f.name}
                        </h3>
                        <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                          <FaTag className="text-[9px]" /> {f.discount} (₹{f.offerPrice})
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                      {f.badgeText}
                    </span>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(key);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        isCurrentLive
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-[#0052cc] hover:bg-blue-700 text-white shadow-sm active:scale-95'
                      }`}
                    >
                      {isCurrentLive ? 'Currently Active' : 'Activate Live'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Custom Pricing & Banner Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <HiSparkles className="text-amber-500 text-lg" />
              <span>Offer Details & Banner</span>
            </h2>

            {/* Banner Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Top Festival Announcement Bar
                </p>
                <p className="text-[11px] text-gray-500">
                  Show ticker at the very top of Navbar
                </p>
              </div>
              <input
                type="checkbox"
                checked={offerActive}
                onChange={(e) => setOfferActive(e.target.checked)}
                className="w-5 h-5 text-[#0052cc] rounded-lg accent-[#0052cc] cursor-pointer"
              />
            </div>

            {/* Custom Offer Price */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Festival Package Price (₹)
              </label>
              <input
                type="text"
                placeholder={festivals[selectedFestival]?.offerPrice || '899'}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0052cc] outline-none text-sm font-bold text-gray-900"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Leave blank to use default (₹{festivals[selectedFestival]?.offerPrice || '899'})
              </p>
            </div>

            {/* Custom Discount Tag */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Discount Tag Text
              </label>
              <input
                type="text"
                placeholder={festivals[selectedFestival]?.discount || '30% OFF'}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0052cc] outline-none text-sm font-bold text-gray-900"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                e.g. 25% OFF, FLAT 30% OFF, SPECIAL OFFER
              </p>
            </div>

            {/* Save Button */}
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(selectedFestival)}
              className="w-full bg-[#0052cc] hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FaSave />
              <span>{isSaving ? 'Updating Website...' : 'Save & Publish Live Theme'}</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaGift className="text-amber-600" />
              <span>How This Works</span>
            </h4>
            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
              Whenever you activate a festival or save custom offer prices here, the changes update immediately on MongoDB and apply live across the entire public website for every visiting customer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFestivals;
