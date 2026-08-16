import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import chatGptImage from '../assets/ChatGPT Image Aug 14, 2026, 11_01_31 AM.png';
import seatImage from '../assets/seat2.png';
import tyerImage from '../assets/tyer.png';

const BeforeAfterGallery = () => {
  const transformations = [
    {
      singleImage: chatGptImage,
      title: 'Exterior Cleaning'
    },
    {
      singleImage: seatImage,
      title: 'Seat Cleaning'
    },
    {
      singleImage: tyerImage,
      title: 'Tyre & Alloy'
    }
  ];

  return (
    <section className="pt-10 pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-slate-800 mb-2">
            See The Transformation<span className="text-blue-600">.</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-normal">
            Real results, real shine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {transformations.map((item, index) => (
            <div key={index} className="w-full flex gap-2 shadow-premium rounded-xl">
              {item.singleImage ? (
                <div className="relative w-full rounded-xl overflow-hidden group flex items-center justify-center bg-gray-100 h-[250px] md:h-[300px]">
                  <img src={item.singleImage} alt={`${item.title}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 relative z-0" />
                </div>
              ) : (
                <>
                  <div className="relative w-1/2 rounded-xl overflow-hidden group h-[250px] md:h-[300px]">
                    <img src={item.before} alt={`Before ${item.title}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-dark/80 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow">Before</div>
                  </div>
                  <div className="relative w-1/2 rounded-xl overflow-hidden group h-[250px] md:h-[300px]">
                    <img src={item.after} alt={`After ${item.title}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-md shadow">After</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex justify-center">
          <Link to="/gallery" className="group relative flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] border-b-4 border-red-800">
            <span className="relative z-10 tracking-widest uppercase text-sm font-extrabold">Explore Full Gallery</span>
            <FaArrowRight className="relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300 text-lg" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterGallery;
