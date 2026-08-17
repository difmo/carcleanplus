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
    <section id="services" className="pt-6 pb-20 bg-transparent relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4 tracking-tight">
            Our Premium Services
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium">
            Choose from our range of professional car care services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-[24px] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-[220px] w-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-primary text-white font-bold py-1.5 px-4 rounded-full text-sm z-20 shadow-lg">
                  ₹{service.price}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow relative z-20 -mt-6 bg-gradient-to-b from-transparent to-[#0a0a0a]">
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">
                  {service.description}
                </p>
                
                <button 
                  onClick={() => openModal(null, service.id)}
                  className="mt-auto flex items-center justify-center gap-2 w-full py-4 px-6 bg-white/5 hover:bg-primary text-white font-bold rounded-xl transition-all duration-300 border border-white/10 hover:border-primary-light hover:shadow-[0_0_20px_rgba(0,82,204,0.7)] group/btn"
                >
                  <span>Book Now</span>
                  <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 flex justify-center">
          <button 
            onClick={() => openModal()}
            className="group relative flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(0,82,204,0.7)] border-b-4 border-primary-dark"
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
