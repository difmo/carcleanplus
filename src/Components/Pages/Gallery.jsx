import React, { useEffect } from 'react';
import chatGptImage from '../../assets/ChatGPT Image Aug 14, 2026, 11_01_31 AM.png';
import seatImage from '../../assets/seat2.png';
import tyerImage from '../../assets/tyer.png';
import carImage from '../../assets/car.jpg';

const Gallery = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const galleryImages = [
    { src: chatGptImage, alt: "Exterior Cleaning" },
    { src: seatImage, alt: "Seat Cleaning" },
    { src: tyerImage, alt: "Tyre Cleaning" },
    { src: carImage, alt: "Car Wash" },
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-dark mb-6 tracking-tight">Our <span className="text-blue-600">Work Gallery</span></h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">Take a look at some of the premium car detailing and cleaning services we've provided to our happy customers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-premium group relative h-64 md:h-80 bg-gray-200">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-bold text-xl tracking-wider">{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
