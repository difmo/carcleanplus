import React, { useState, useMemo } from 'react';
import { useBooking } from '../../context/BookingContext';
import { CAR_MODELS, SERVICES, getPrice } from '../../utils/pricingLogic';
import { FaTimes, FaSearch, FaCar, FaCheckCircle, FaMapMarkerAlt, FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { SiSuzuki, SiHyundai, SiTata, SiHonda, SiToyota, SiVolkswagen, SiSkoda, SiKia, SiRenault, SiNissan, SiFord, SiJeep, SiAudi, SiBmw, SiFiat, SiChevrolet } from 'react-icons/si';

const getCarIcon = (carName) => {
  const name = carName.toLowerCase();
  if (name.includes('maruti') || name.includes('suzuki')) return <SiSuzuki />;
  if (name.includes('hyundai')) return <SiHyundai />;
  if (name.includes('tata')) return <SiTata />;
  if (name.includes('honda')) return <SiHonda />;
  if (name.includes('toyota')) return <SiToyota />;
  if (name.includes('volkswagen')) return <SiVolkswagen />;
  if (name.includes('skoda')) return <SiSkoda />;
  if (name.includes('kia')) return <SiKia />;
  if (name.includes('renault')) return <SiRenault />;
  if (name.includes('nissan')) return <SiNissan />;
  if (name.includes('ford')) return <SiFord />;
  if (name.includes('jeep')) return <SiJeep />;
  if (name.includes('audi')) return <SiAudi />;
  if (name.includes('bmw')) return <SiBmw />;
  if (name.includes('fiat')) return <SiFiat />;
  if (name.includes('chevrolet')) return <SiChevrolet />;
  if (name.includes('mg')) return <span className="font-black font-serif text-xl">MG</span>;
  if (name.includes('mahindra')) return <span className="font-black font-serif text-xl">M</span>;
  if (name.includes('citroën') || name.includes('citroen')) return <span className="font-black font-serif text-xl">C</span>;
  if (name.includes('datsun')) return <span className="font-black font-serif text-xl">D</span>;
  if (name.includes('bajaj')) return <span className="font-black font-serif text-xl">B</span>;
  return <FaCar />;
};

const BookingModal = () => {
  const { bookingState, updateBooking, nextStep, prevStep, setStep, closeModal, resetBooking } = useBooking();
  const { isModalOpen, currentStep } = bookingState;

  const [searchCity, setSearchCity] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const CITIES = ['Lucknow', 'Mumbai', 'Indore', 'Patna', 'Ahmedabad', 'Kolkata', 'Delhi', 'Pune', 'Bangalore', 'Noida', 'Gurgaon'];
  
  const BRANDS = useMemo(() => {
    const brandSet = new Set();
    CAR_MODELS.forEach(car => {
      const brand = car.name.split(' ')[0];
      brandSet.add(brand);
    });
    return Array.from(brandSet).sort();
  }, []);

  if (!isModalOpen) return null;

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(searchCity.toLowerCase()));
  const filteredBrands = BRANDS.filter(b => b.toLowerCase().includes(searchBrand.toLowerCase()));
  
  const brandModels = CAR_MODELS.filter(car => car.name.startsWith(bookingState.carBrand));
  const filteredModels = brandModels.filter(car => car.name.toLowerCase().includes(searchModel.toLowerCase()));

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    
    // Simulating API call since backend is not running yet
    setTimeout(() => {
      setIsSubmitting(false);
      setBookingConfirmed(true);
    }, 1500);
  };

  const renderHeaderIcon = (icon = <FaCar />, cornerIcon = <FaMapMarkerAlt />) => (
    <div className="flex justify-center mb-8 mt-2 relative">
      <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-[1.5rem] flex items-center justify-center relative shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
        <div className="text-4xl text-gray-800 drop-shadow-sm">{icon}</div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#0052cc] rounded-full flex items-center justify-center border-[3px] border-white shadow-sm">
          <div className="text-white text-[11px]">{cornerIcon}</div>
        </div>
      </div>
    </div>
  );

  const renderCloseButton = () => (
    <button onClick={closeModal} className="absolute right-4 top-4 p-2.5 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all z-10">
      <FaTimes className="text-sm" />
    </button>
  );

  const renderBackButton = () => (
    <button onClick={prevStep} className="absolute left-4 top-4 p-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all z-10 shadow-sm border border-gray-100">
      <FaArrowLeft className="text-sm" />
    </button>
  );

  const renderStep1 = () => (
    <div className="animate-fade-in flex flex-col h-full relative">
      {renderCloseButton()}
      {renderHeaderIcon()}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-black text-gray-900 mb-2.5 tracking-tight">Set up your booking</h2>
        <p className="text-gray-500 text-[15px] px-6 leading-relaxed">Add your location and car to see exact prices, offers and available slots.</p>
      </div>

      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-[1.5rem] overflow-hidden flex flex-col flex-1 min-h-[200px]">
        <div className="p-5 flex items-center gap-3 border-b border-gray-50 bg-gray-50/50">
          <FaMapMarkerAlt className="text-gray-800 text-lg" />
          <span className="font-extrabold text-gray-900 text-lg">Select City</span>
        </div>
        <div className="p-4 bg-white border-b border-gray-50 sticky top-0 z-10">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search city..."
              className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-[0_2px_10px_rgba(0,82,204,0.04)] hover:shadow-[0_4px_15px_rgba(0,82,204,0.08)] focus:shadow-[0_8px_30px_rgba(0,82,204,0.12)]"
              value={searchCity}
              onChange={e => setSearchCity(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-y-auto custom-scrollbar bg-white p-2">
          {filteredCities.map(city => (
            <div
              key={city}
              onClick={() => {
                updateBooking('city', city);
                nextStep();
              }}
              className="px-5 py-3.5 mx-2 my-1 rounded-xl text-gray-600 text-[15px] font-bold hover:bg-blue-50 hover:text-[#003380] cursor-pointer transition-all flex justify-between items-center group"
            >
              {city}
              <FaChevronRight className="text-[#0052cc] opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
            </div>
          ))}
          {filteredCities.length === 0 && <div className="p-6 text-center text-[15px] text-gray-400 font-medium">No city found</div>}
        </div>
      </div>
      
      <div className="mt-4 pt-2 pb-2">
        <button disabled className="w-full bg-gray-100 text-gray-400 font-extrabold py-4 rounded-[1.25rem] text-[17px] cursor-not-allowed">Continue</button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in relative flex flex-col h-full">
      {renderCloseButton()}
      {renderBackButton()}

      {renderHeaderIcon()}
      <div className="text-center mb-8">
        <h2 className="text-[28px] font-black text-gray-900 mb-2.5 tracking-tight">Select Vehicle Make</h2>
        <p className="text-gray-500 text-[15px] px-6 leading-relaxed">Choose your car details to see exact prices and available slots.</p>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
        </div>
        <input
          type="text"
          placeholder="Search car brand..."
          className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-[0_2px_10px_rgba(0,82,204,0.04)] hover:shadow-[0_4px_15px_rgba(0,82,204,0.08)] focus:shadow-[0_8px_30px_rgba(0,82,204,0.12)]"
          value={searchBrand}
          onChange={e => setSearchBrand(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar flex-1 pb-4 content-start min-h-[200px]">
        {filteredBrands.map(brand => (
          <div
            key={brand}
            onClick={() => {
              updateBooking('carBrand', brand);
              nextStep();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-[1.25rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-[#0052cc] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer transition-all aspect-[4/3] gap-2.5 group"
          >
            <div className="text-3xl text-gray-700 group-hover:text-blue-500 flex items-center justify-center h-8 transition-colors">{getCarIcon(brand)}</div>
            <span className="text-[11px] font-extrabold text-gray-800 tracking-wide text-center uppercase group-hover:text-[#0043a8] transition-colors">{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in relative flex flex-col h-full bg-gray-50/50 rounded-[2rem] -mx-6 -my-6 p-6">
      {renderBackButton()}
      
      {renderHeaderIcon(getCarIcon(bookingState.carBrand))}
      <div className="text-center mb-8">
        <h2 className="text-[26px] font-black text-gray-900 mb-2.5 tracking-tight">Select {bookingState.carBrand} Model</h2>
        <p className="text-gray-500 text-[15px] px-6 leading-relaxed">Choose your car details to see exact prices and available slots.</p>
      </div>

      <div className="relative mb-6 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-[#0052cc]/40 group-hover:text-[#0052cc]/70 group-focus-within:text-[#0052cc] transition-colors duration-300 text-sm" />
        </div>
        <input
          type="text"
          placeholder={`Search ${bookingState.carBrand} models...`}
          className="w-full bg-white border-2 border-[#0052cc]/15 hover:border-[#0052cc]/40 focus:border-[#0052cc] pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-bold text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 shadow-[0_2px_10px_rgba(0,82,204,0.04)] hover:shadow-[0_4px_15px_rgba(0,82,204,0.08)] focus:shadow-[0_8px_30px_rgba(0,82,204,0.12)]"
          value={searchModel}
          onChange={e => setSearchModel(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5 overflow-y-auto custom-scrollbar flex-1 pb-4 content-start min-h-[200px] px-1">
        {filteredModels.map(car => (
          <div
            key={car.id}
            onClick={() => {
              updateBooking('carModel', car);
              nextStep();
            }}
            className="flex flex-col items-center justify-between p-5 rounded-[1.25rem] border border-gray-100 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:border-[#0052cc] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer transition-all aspect-[4/3] group"
          >
            <FaCar className="text-5xl text-gray-300 group-hover:text-blue-300 transition-colors" />
            <div className="text-center mt-3 w-full">
              <h4 className="font-extrabold text-gray-900 text-[14px] truncate">{car.name.replace(`${bookingState.carBrand} `, '')}</h4>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold mt-1 block">{car.category}</span>
            </div>
          </div>
        ))}
        {filteredModels.length === 0 && <div className="col-span-2 text-center py-10 text-gray-400 text-[15px] font-medium">No models found</div>}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const category = bookingState.carModel?.category || 'STANDARD';
    const packages = [
      { id: SERVICES.BASIC, title: 'Bucket Wash - Basic', reviews: '2.5k reviews', rating: '3.9', features: ['Exterior Ceramic Wash', 'Tyre Polish'] },
      { id: SERVICES.PREMIUM, title: 'Pressure Wash - Premium', reviews: '6.8k reviews', rating: '4.6', features: ['Exterior High Pressure Wash', 'Tyre Polish'] },
      { id: SERVICES.COMPLETE, title: '360 Deep Cleaning', reviews: '3.2k reviews', rating: '4.4', features: ['Interior Vacuum', 'Roof Cleaning', 'Seat Cleaning'] }
    ];

    return (
      <div className="animate-fade-in relative flex flex-col h-full bg-gray-50/50 rounded-[2rem] -mx-6 -my-6 p-6">
        <div className="flex items-center gap-4 mb-2 pt-2">
          <button onClick={prevStep} className="p-2 bg-white text-gray-600 hover:text-gray-900 rounded-full shadow-sm border border-gray-100 transition-all"><FaArrowLeft className="text-sm" /></button>
          <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Choose a Package</h2>
        </div>
        <p className="text-gray-500 text-[12px] font-semibold mb-4 px-1 tracking-wide">All Packages include doorstep service & premium products</p>

        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pb-2 pr-1 px-1">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => updateBooking('service', pkg.id)}
              className={`p-3.5 rounded-[1.25rem] border transition-all cursor-pointer flex gap-3 shadow-sm ${bookingState.service === pkg.id ? 'bg-blue-50/50 border-[#0052cc] ring-2 ring-[#0052cc]/20 shadow-[#0052cc]/10' : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
            >
              <div className="w-[60px] h-[60px] bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                <FaCar className="text-gray-300 text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-gray-900 text-[14px] leading-tight truncate">{pkg.title}</h4>
                <div className="flex items-center gap-2 mt-1 mb-1.5">
                  <div className="font-black text-gray-900 text-[18px]">₹{getPrice(category, pkg.id)}</div>
                  <div className="bg-blue-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="text-[#0052cc] text-[9px]">★</span>
                    <span className="font-bold text-gray-900 text-[10px]">{pkg.rating}</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="text-[11px] text-gray-600 font-semibold flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 text-[9px] flex-shrink-0" /> <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-center pl-1">
                <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-colors ${bookingState.service === pkg.id ? 'border-[#0052cc] bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  {bookingState.service === pkg.id && <div className="w-2 h-2 bg-[#0052cc] rounded-full"></div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-2">
          <button 
            onClick={nextStep}
            disabled={!bookingState.service}
            className="w-full bg-[#0052cc] text-gray-900 font-black py-4 rounded-[1.25rem] text-[17px] transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-blue-500 shadow-[0_8px_30px_rgb(250,204,21,0.3)] disabled:shadow-none"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="animate-fade-in relative flex flex-col h-full pt-6">
      {renderCloseButton()}
      {renderBackButton()}

      <div className="text-center w-full max-w-sm mx-auto mt-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-200/50">
          <FaCar className="text-3xl text-blue-500" />
        </div>
        <h2 className="text-[32px] font-black text-gray-900 mb-3 tracking-tight leading-tight">Welcome to<br/>Car Clean Plus</h2>
        <p className="text-gray-500 text-[14px] mb-12 leading-relaxed px-4 font-medium">
          Login to book top car wash and car services at your doorstep.
        </p>

        <div className="w-full text-left">
          <label className="block text-[11px] font-black text-gray-400 mb-2.5 uppercase tracking-widest pl-1">Mobile Number</label>
          <div className="flex bg-white border border-gray-200 rounded-[1.25rem] overflow-hidden focus-within:border-[#0052cc] focus-within:ring-4 focus-within:ring-[#0052cc]/10 transition-all mb-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="bg-gray-50/50 px-5 py-4 border-r border-gray-100 flex items-center font-black text-gray-900 text-[15px]">
              +91
            </div>
            <input
              type="tel"
              className="flex-1 px-5 py-4 bg-transparent outline-none text-gray-900 font-bold placeholder-gray-300 disabled:opacity-50 text-[16px] tracking-wide"
              value={bookingState.mobile}
              onChange={(e) => updateBooking('mobile', e.target.value)}
              placeholder="Phone number"
              maxLength="10"
            />
          </div>

          
        </div>
      </div>

      <div className="mt-auto pt-6 pb-2">
        <button
          onClick={() => {
            if (bookingState.mobile.length === 10) handleConfirmBooking();
            else alert("Please enter a valid 10-digit number");
          }}
          disabled={isSubmitting || bookingState.mobile.length < 10}
          className="w-full bg-gray-900 text-white font-black py-4 rounded-[1.25rem] text-[17px] hover:bg-black transition-all disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 shadow-[0_8px_30px_rgb(0,0,0,0.2)] disabled:shadow-none"
        >
          {isSubmitting ? 'Confirming...' : 'Book Now'}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-10 animate-fade-in flex flex-col h-full justify-center">
      <div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-[8px] border-green-100/50 shadow-[0_8px_30px_rgb(34,197,94,0.15)] relative">
        <FaCheckCircle className="text-6xl text-green-500 relative z-10 bg-white rounded-full" />
      </div>
      <h2 className="text-[32px] font-black text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h2>
      <p className="text-gray-500 text-[15px] mb-12 px-2 leading-relaxed font-medium">Thank you for choosing Car Clean Plus. Our executive will call you shortly to confirm your exact location and preferred time.</p>

      <div className="bg-gray-50 p-6 rounded-[1.5rem] border border-gray-100 mb-12 text-left shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)]">
        <p className="text-[11px] text-gray-400 mb-1.5 uppercase tracking-widest font-black">Booking ID</p>
        <p className="font-black text-[26px] text-gray-900 mb-6 tracking-tight">CCP-{Math.floor(Math.random() * 90000) + 10000}</p>
        
        <div className="space-y-3 pt-4 border-t border-gray-200/60">
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500 font-bold">Service</span>
            <span className="text-[13px] font-black text-gray-900">{bookingState.service}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500 font-bold">Vehicle</span>
            <span className="text-[13px] font-black text-gray-900">{bookingState.carModel?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] text-gray-500 font-bold">City</span>
            <span className="text-[13px] font-black text-gray-900">{bookingState.city}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          resetBooking();
          closeModal();
        }}
        className="w-full bg-gray-900 text-white hover:bg-black font-black py-4 px-8 rounded-[1.25rem] transition-all text-[17px] shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-[380px] max-h-[98vh] flex flex-col relative overflow-hidden transform transition-all border border-gray-100">
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto flex flex-col relative custom-scrollbar">
          {!bookingConfirmed && currentStep === 1 && renderStep1()}
          {!bookingConfirmed && currentStep === 2 && renderStep2()}
          {!bookingConfirmed && currentStep === 3 && renderStep3()}
          {!bookingConfirmed && currentStep === 4 && renderStep4()}
          {!bookingConfirmed && currentStep === 5 && renderStep5()}
          {bookingConfirmed && renderSuccess()}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default BookingModal;
