import React, { useState, useEffect } from 'react';
import { CAR_MODELS, CAR_CATEGORIES, PRICING_MATRIX, SERVICES } from '../../utils/pricingLogic';
import { useBooking } from '../../context/BookingContext';
import { FaSearch, FaCarSide, FaCheckCircle } from 'react-icons/fa';

const PricingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { openModal } = useBooking();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredCars = CAR_MODELS.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCarImage = (category) => {
    switch (category) {
      case CAR_CATEGORIES.COMPACT:
        return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400';
      case CAR_CATEGORIES.STANDARD:
        return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=400';
      case CAR_CATEGORIES.LARGE:
      case CAR_CATEGORIES.PREMIUM:
        return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400';
      default:
        return 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&q=80&w=400';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Simple & Clean Header (Matches Gallery/FAQ) */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-dark mb-6 tracking-tight">
            Clear & Transparent <span className="text-blue-600">Pricing</span>
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Search for your car below to see exact pricing for our professional doorstep detailing.
          </p>
        </div>

        {/* Clean Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search your car (e.g., Swift, Creta, Nexon)..." 
              className="w-full pl-14 pr-6 py-4 rounded-full bg-white border border-gray-200 shadow-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all text-lg font-medium text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => {
            const basicPrice = PRICING_MATRIX[car.category][SERVICES.BASIC];
            const premiumPrice = PRICING_MATRIX[car.category][SERVICES.PREMIUM];
            const completePrice = PRICING_MATRIX[car.category][SERVICES.COMPLETE];

            return (
              <div 
                key={car.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 flex flex-col animate-fade-in"
                style={{ animationDelay: `${(index % 6) * 0.1}s` }}
              >
                {/* Car Image Placeholder */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img 
                    src={getCarImage(car.category)} 
                    alt={car.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1">
                    <FaCarSide className="text-blue-500" />
                    {car.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-extrabold text-white">{car.name}</h3>
                </div>

                {/* Pricing Details - Clickable Services */}
                <div className="p-4 flex-grow flex flex-col gap-3">
                  
                  {/* Basic Wash */}
                  <button 
                    onClick={() => openModal(car, SERVICES.BASIC)}
                    className="w-full text-left flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all group"
                  >
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Basic Wash</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-500/70">Exterior Wash & Dry</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className="font-extrabold text-lg text-gray-700 group-hover:text-blue-700 block transition-transform group-hover:-translate-y-1">₹{basicPrice}</span>
                      <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-all absolute mt-6 uppercase tracking-wider">Book Now →</span>
                    </div>
                  </button>

                  {/* Premium Wash */}
                  <button 
                    onClick={() => openModal(car, SERVICES.PREMIUM)}
                    className="w-full text-left flex justify-between items-center p-3 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-100/60 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-bl-full -z-10"></div>
                    <div>
                      <p className="font-bold text-blue-700 flex items-center gap-1">
                        Premium Wash <FaCheckCircle className="text-blue-500 text-xs" />
                      </p>
                      <p className="text-xs text-blue-600/70">Exterior + Basic Interior</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className="font-extrabold text-xl text-blue-700 block transition-transform group-hover:-translate-y-1">₹{premiumPrice}</span>
                      <span className="text-[10px] text-blue-700 font-bold opacity-0 group-hover:opacity-100 transition-all absolute mt-7 uppercase tracking-wider">Book Now →</span>
                    </div>
                  </button>

                  {/* Complete Clean */}
                  <button 
                    onClick={() => openModal(car, SERVICES.COMPLETE)}
                    className="w-full text-left flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md transition-all group"
                  >
                    <div>
                      <p className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">Complete Clean</p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-500/70">Detailed Interior & Exterior</p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-center">
                      <span className="font-extrabold text-lg text-gray-700 group-hover:text-blue-700 block transition-transform group-hover:-translate-y-1">₹{completePrice}</span>
                      <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-all absolute mt-6 uppercase tracking-wider">Book Now →</span>
                    </div>
                  </button>

                </div>
              </div>
            );
          })}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-400 mb-2">No cars found matching "{searchQuery}"</p>
            <p className="text-gray-500">Please try a different model or brand name.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PricingPage;
