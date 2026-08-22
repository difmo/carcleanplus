import React, { useEffect } from 'react';
import chatGptImage from '../../assets/ChatGPT Image Aug 14, 2026, 11_01_31 AM.png';
import seatImage from '../../assets/seat2.png';
import tyerImage from '../../assets/tyer.png';
import carImage from '../../assets/car.jpg';
import gl1 from '../../assets/gl 1.png';
import gl2 from '../../assets/gl 2.png';
import gl3 from '../../assets/gl 3.png';
import gl4 from '../../assets/gl 4.png';
import gl5 from '../../assets/gl 5.png';
import gl6 from '../../assets/gl 6.png';
import gl7 from '../../assets/gl 7.png';
import gl8 from '../../assets/gl8.png';

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
    { src: gl1, alt: "Car Detailing" },
    { src: gl2, alt: "Premium Wash" },
    { src: gl3, alt: "Interior Cleaning" },
    { src: gl4, alt: "Exterior Polish" },
    { src: gl5, alt: "Deep Cleaning" },
    { src: gl6, alt: "Car Care" },
    { src: gl7, alt: "Professional Wash" },
    { src: gl8, alt: "Shiny Finish" },
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

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
