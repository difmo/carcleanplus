import React from 'react';
import { useBooking } from '../context/BookingContext';
import { FaArrowRight } from 'react-icons/fa';
import basicWashImg from '../assets/basic wash.png';
import standardWashImg from '../assets/Standard Wash.png';
import interiorCleaningImg from '../assets/Interior Cleaning.png';
import dashboardPolishImg from '../assets/Dashboard Polish.png';
import tyreRimShineImg from '../assets/Tyre & Rim Shine.png';
import completeDetailingImg from '../assets/Complete Detailing.png';

const ServicesPricing = () => {
  const { openModal } = useBooking();

  const services = [
    {
      id: 'basic',
      name: 'Basic Wash',
      description: 'Exterior wash to remove dust & dirt.',
      price: '299',
      image: basicWashImg
    },
    {
      id: 'standard',
      name: 'Standard Wash',
      description: 'Exterior + Interior vacuum cleaning.',
      price: '399',
      image: standardWashImg
    },
    {
      id: 'interior',
      name: 'Interior Cleaning',
      description: 'Deep cleaning of seats, mats & interior.',
      price: '599',
      image: interiorCleaningImg
    },
    {
      id: 'dashboard',
      name: 'Dashboard Polish',
      description: 'Dashboard & plastic polish & shine.',
      price: '249',
      image: dashboardPolishImg
    },
    {
      id: 'tyre',
      name: 'Tyre & Rim Shine',
      description: 'Tyre cleaning & premium shine.',
      price: '149',
      image: tyreRimShineImg
    },
    {
      id: 'complete',
      name: 'Complete Detailing',
      description: 'Interior + Exterior complete detailing.',
      price: '999',
      image: completeDetailingImg
    }
  ];

  return (
    <section id="services" className="pt-6 pb-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-4 tracking-tight">Premium Car Cleaning Services</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">Experience the ultimate shine with our expertly crafted detailing packages, delivered right to your doorstep.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 max-w-[1400px] mx-auto mb-10">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl flex flex-col justify-between overflow-hidden border border-gray-100 shadow-premium transition-all duration-300"
            >
              <div className="w-full h-40 md:h-32 xl:h-40 overflow-hidden relative">
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-dark/5"></div>
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between text-center bg-white">
                <div>
                  <h3 className="text-sm xl:text-base font-bold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-gray-500 text-xs mb-4 leading-relaxed">{service.description}</p>
                </div>
                <div>
                  <div className="text-blue-600 font-extrabold text-lg xl:text-xl mb-3"><span className="text-xs text-gray-400 font-normal mr-1">Starts at</span>₹{service.price}</div>
                  <button 
                    onClick={() => openModal()}
                    className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs xl:text-sm font-bold shadow-md transition-colors duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 flex justify-center">
          <button 
            onClick={() => openModal()}
            className="group relative flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] border-b-4 border-red-800"
          >
            <span className="relative z-10 tracking-widest uppercase text-sm font-extrabold">View All Services</span>
            <FaArrowRight className="relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300 text-lg" />
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesPricing;
