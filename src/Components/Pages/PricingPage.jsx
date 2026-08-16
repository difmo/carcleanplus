import React, { useState, useMemo } from 'react';
import { FaSearch, FaGem } from 'react-icons/fa';
import { CAR_MODELS, PRICING_MATRIX, SERVICES, CAR_CATEGORIES } from '../../utils/pricingLogic';
import { useBooking } from '../../context/BookingContext';

const PricingPage = () => {
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
        return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-bold uppercase tracking-wider">{category}</span>;
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 relative overflow-hidden font-sans">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight font-heading">
            Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">Pricing Matrix</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-in relative" style={{ animationDelay: '0.1s' }}>
          {/* Subtle glow behind search bar */}
          <div className="absolute inset-0 bg-red-600/10 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative group p-[1px] rounded-full bg-gradient-to-r from-red-500/20 via-red-900/40 to-red-500/20 hover:from-red-500/50 hover:via-red-500/30 hover:to-red-500/50 transition-all duration-500 shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] focus-within:shadow-[0_0_40px_rgba(220,38,38,0.3)] focus-within:from-red-500/60 focus-within:to-red-500/60">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
              <FaSearch className="text-red-500/70 text-xl group-focus-within:text-red-500 group-hover:scale-110 transition-all duration-300" />
            </div>
            <input 
              type="text" 
              placeholder="Search by make or model (e.g., Maruti, Nexon)..." 
              className="w-full pl-16 pr-6 py-4 rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl outline-none transition-all text-lg font-medium text-white placeholder-gray-400 relative z-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Premium Table Layout */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.05)] animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-white/5 to-red-900/10 border-b border-red-500/20 text-red-500 text-xs md:text-sm uppercase tracking-widest">
                  <th className="px-6 py-5 font-bold">Brand</th>
                  <th className="px-6 py-5 font-bold">Car Model</th>
                  <th className="px-6 py-5 font-bold text-center">Category</th>
                  <th className="px-6 py-5 font-bold text-center">Basic Wash (₹)</th>
                  <th className="px-6 py-5 font-bold text-center text-red-400 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">Premium Wash (₹)</th>
                  <th className="px-6 py-5 font-bold text-center">Complete Clean (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCars.map((car, index) => {
                  const [brand, ...modelParts] = car.name.split(' ');
                  const modelName = modelParts.join(' ');
                  
                  const basicPrice = PRICING_MATRIX[car.category][SERVICES.BASIC];
                  const premiumPrice = PRICING_MATRIX[car.category][SERVICES.PREMIUM];
                  const completePrice = PRICING_MATRIX[car.category][SERVICES.COMPLETE];

                  return (
                    <tr 
                      key={car.id} 
                      className="group hover:bg-gradient-to-r hover:from-white/5 hover:to-red-900/10 transition-all duration-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300 font-medium">{brand}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-white font-bold text-base">{modelName}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getCategoryBadge(car.category)}
                      </td>
                      
                      {/* Pricing Cells - Clickable */}
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openModal(car, SERVICES.BASIC)}
                          className="w-full h-full py-2 px-3 rounded-lg hover:bg-white/10 text-gray-300 font-bold transition-all group-hover:text-white"
                        >
                          {basicPrice}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center bg-red-500/5 group-hover:bg-red-500/10 transition-colors border-x border-red-500/5 group-hover:border-red-500/20">
                        <button 
                          onClick={() => openModal(car, SERVICES.PREMIUM)}
                          className="w-full h-full py-2 px-3 rounded-lg hover:bg-red-500/20 text-red-500 font-extrabold text-lg transition-all scale-100 hover:scale-110 drop-shadow-[0_0_5px_rgba(220,38,38,0.4)]"
                        >
                          {premiumPrice}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => openModal(car, SERVICES.COMPLETE)}
                          className="w-full h-full py-2 px-3 rounded-lg hover:bg-white/10 text-gray-300 font-bold transition-all group-hover:text-white"
                        >
                          {completePrice}
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
              <p className="text-2xl font-bold text-gray-400 mb-2">No cars found matching "{searchQuery}"</p>
              <p className="text-gray-500">Please try a different model or brand name.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PricingPage;

