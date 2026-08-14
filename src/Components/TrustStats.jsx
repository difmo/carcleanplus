import React from 'react';
import { FaUsers, FaShieldAlt, FaClock, FaStar } from 'react-icons/fa';

import bgImage from '../assets/landing.jpg'; 
import img1 from '../assets/car.jpg';
import img2 from '../assets/wash car.png';
import img3 from '../assets/home1.png';
import img4 from '../assets/Complete Detailing.png';

const TrustStats = () => {
  const stats = [
    {
      icon: <FaUsers className="text-xl md:text-2xl text-white" />,
      value: '500+',
      label: 'HAPPY CUSTOMERS',
      desc: 'Trusted by thousands',
      image: img1
    },
    {
      icon: <FaShieldAlt className="text-xl md:text-2xl text-white" />,
      value: '100%',
      label: 'SATISFACTION',
      desc: 'Guaranteed service',
      image: img2
    },
    {
      icon: <FaClock className="text-xl md:text-2xl text-white" />,
      value: 'On-Time',
      label: 'SERVICE',
      desc: 'Always on schedule',
      image: img3
    },
    {
      icon: <FaStar className="text-xl md:text-2xl text-white" />,
      value: '4.8/5',
      label: 'RATING',
      desc: 'Highly rated by users',
      image: img4
    }
  ];

  return (
    <div className="relative -mt-16 lg:-mt-24 z-20 container mx-auto px-4 pb-12">
      
      {/* Outer wrapper to hold the dark background like a floating card */}
      <div className="relative bg-[#050b14]/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-blue-500/20 overflow-hidden p-6 md:p-8 transform transition-transform duration-500 hover:-translate-y-1">
        
        {/* Subtle Background Image within the floating box */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="relative z-10">
          
          {/* Header section - Compact */}
          <div className="text-center mb-6">
            <p className="text-blue-500 font-bold tracking-widest uppercase mb-1 text-[10px] md:text-xs">Our Commitment</p>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white mb-2 tracking-tight">Quality You Can Trust</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-blue-500/50"></div>
              <div className="w-5 h-1.5 rounded-full border border-blue-500/50 flex items-center justify-center">
                 <div className="w-2 h-0.5 rounded-full bg-blue-500"></div>
              </div>
              <div className="h-[1px] w-8 bg-blue-500/50"></div>
            </div>
          </div>

          {/* Stats Grid - Compact Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col bg-[#0b162c]/80 backdrop-blur-sm rounded-xl border border-blue-500/20 overflow-hidden hover:border-blue-400/50 transition-all duration-300 group shadow-lg">
                
                {/* Content Area */}
                <div className="p-4 md:p-5 flex flex-col items-center text-center flex-grow">
                  <div className="mb-3 bg-blue-600/20 p-3 rounded-full border border-blue-500/30 group-hover:scale-110 group-hover:bg-blue-600/30 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-blue-300 to-blue-600 mb-1 tracking-tight">
                    {stat.value}
                  </h3>
                  <h4 className="text-white text-[9px] md:text-[10px] font-bold tracking-widest uppercase mb-1">
                    {stat.label}
                  </h4>
                  <p className="text-gray-400 text-[9px] md:text-[10px] leading-relaxed max-w-[150px]">
                    {stat.desc}
                  </p>
                </div>

                {/* Bottom Image Area - Very Compact */}
                <div className="h-16 md:h-20 w-full relative overflow-hidden mt-auto">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b162c] to-transparent z-10 pointer-events-none"></div>
                   <img 
                     src={stat.image} 
                     alt={stat.label} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-80" 
                   />
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrustStats;
