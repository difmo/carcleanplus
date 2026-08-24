import React, { useState, useMemo, useEffect } from 'react';
import { FaSearch, FaGem } from 'react-icons/fa';
import { CAR_MODELS, PRICING_MATRIX, SERVICES, CAR_CATEGORIES, getPrice } from '../../utils/pricingLogic';
import { useBooking } from '../../context/BookingContext';

const PricingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const { openModal } = useBooking();

  const filteredCars = useMemo(() => {
    return CAR_MODELS.filter(car =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getCategoryBadge = (category) => {
    switch (category) {
      case CAR_CATEGORIES.COMPACT:
        return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
      case CAR_CATEGORIES.STANDARD:
        return <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
      case CAR_CATEGORIES.LARGE:
        return <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
      case CAR_CATEGORIES.PREMIUM:
        return <span className="px-3 py-1 rounded-full bg-primary-light/10 text-red-400 border border-primary-light/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">

        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight font-heading">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Pricing Matrix</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-in relative" style={{ animationDelay: '0.1s' }}>
          <div className="relative group p-[1px] rounded-full bg-white border border-gray-200 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-lg focus-within:shadow-lg focus-within:border-primary">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
              <FaSearch className="text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by make or model (e.g., Maruti, Nexon)..."
              className="w-full pl-16 pr-6 py-4 rounded-full bg-white outline-none transition-all text-lg font-medium text-gray-900 placeholder-gray-400 relative z-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Premium Table Layout */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-primary font-bold text-xs md:text-sm uppercase tracking-widest">
                  <th className="px-6 py-5 font-bold text-gray-700">Brand</th>
                  <th className="px-6 py-5 font-bold text-gray-700">Car Model</th>
                  <th className="px-6 py-5 font-bold text-center text-gray-700">Category</th>
                  <th className="px-6 py-5 font-bold text-center text-gray-700">Basic Wash (₹)</th>
                  <th className="px-6 py-5 font-bold text-center text-primary drop-shadow-sm">Premium Wash (₹)</th>
                  <th className="px-6 py-5 font-bold text-center text-gray-700">Complete Clean (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCars.map((car, index) => {
                  const [brand, ...modelParts] = car.name.split(' ');
                  const modelName = modelParts.join(' ');

                  const basicPrice = getPrice(car.category, SERVICES.BASIC);
                  const premiumPrice = getPrice(car.category, SERVICES.PREMIUM);
                  const completePrice = getPrice(car.category, SERVICES.COMPLETE);

                  return (
                    <tr
                      key={car.id}
                      className="group hover:bg-blue-50/50 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-500 font-medium">{brand}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 font-bold text-base">{modelName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getCategoryBadge(car.category)}
                      </td>

                      {/* Pricing Cells - Clickable */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openModal(car, SERVICES.BASIC)}
                          className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-sm transition-all hover:border-primary hover:text-primary flex items-center justify-between group-hover:shadow-sm"
                        >
                          <span className="text-xs uppercase tracking-wider font-extrabold opacity-70">Book</span>
                          <span>₹{basicPrice}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center bg-blue-50/30 group-hover:bg-blue-50/50 transition-colors border-x border-blue-100/50">
                        <button
                          onClick={() => openModal(car, SERVICES.PREMIUM)}
                          className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-sm transition-all shadow-[0_4px_14px_rgba(0,82,204,0.25)] hover:shadow-[0_6px_20px_rgba(0,82,204,0.4)] hover:bg-blue-600 flex items-center justify-between group-hover:scale-105"
                        >
                          <span className="text-xs uppercase tracking-wider font-extrabold opacity-90">Book</span>
                          <span className="font-black text-base">₹{premiumPrice}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openModal(car, SERVICES.COMPLETE)}
                          className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-sm transition-all hover:border-primary hover:text-primary flex items-center justify-between group-hover:shadow-sm"
                        >
                          <span className="text-xs uppercase tracking-wider font-extrabold opacity-70">Book</span>
                          <span>₹{completePrice}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-20 px-6">
              <p className="text-2xl font-bold text-gray-900 mb-2">No cars found matching "{searchQuery}"</p>
              <p className="text-gray-500">Please try a different model or brand name.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PricingPage;

