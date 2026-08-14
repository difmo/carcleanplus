import React from 'react';
import { useBooking } from '../context/BookingContext';

const HowItWorks = () => {
  const { openModal } = useBooking();

  const steps = [
    {
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=600',
      title: 'Choose Your Car',
      description: 'Search and select your exact car model.',
      step: 1
    },
    {
      image: 'https://images.unsplash.com/photo-1517594422361-5e18140cf61c?auto=format&fit=crop&q=80&w=600',
      title: 'Select Service & Time',
      description: 'Pick your wash service and preferred time slot.',
      step: 2
    },
    {
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
      title: 'Enter Location',
      description: 'Add your address. We come to your doorstep!',
      step: 3
    },
    {
      image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600',
      title: 'Relax & Enjoy',
      description: 'Sit back while we clean your car to perfection.',
      step: 4
    }
  ];

  return (
    <section className="pt-6 pb-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-dark mb-4 tracking-tight">4 Simple Steps</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-medium">Booking a professional car wash has never been easier. Click on any step to start!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              onClick={openModal}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-premium p-4 transition-all duration-300 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-2"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden mb-6 relative">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                <div className="absolute inset-0 bg-dark/10 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-accent transition-colors">{step.title}</h3>
              <p className="text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
