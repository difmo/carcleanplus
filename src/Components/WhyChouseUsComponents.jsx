import React from "react";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
import aboutImg from "../assets/about section .jpeg";

function WhyChouseUsComponents() {
  const points = [
    "Doorstep Service at Your Convenience",
    "Trained & Verified Professionals",
    "High-Quality Equipment & Products",
    "Affordable Pricing & Transparent Deals",
    "Eco-Friendly & Car-Safe Chemicals",
    "On-Time Service & 100% Satisfaction",
  ];

  return (
    <div id="about" className="bg-[#0b1b26] text-white relative mt-10 pb-20">
      {/* SVG Wave Separator */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-[99%]">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[90px]">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#0b1b26"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-1/2">
            <p className="text-blue-500 font-bold tracking-widest uppercase mb-2 text-xs md:text-sm">About Us</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-heading font-bold mb-4 leading-tight">
              Why Car Clean Plus?
            </h2>
            <p className="text-gray-300 mb-6 max-w-xl text-sm md:text-base leading-relaxed">
              We are committed to giving your car the best care and you the best experience. Experience a new level of clean with our professional doorstep services.
            </p>

            <ul className="space-y-3 mb-8">
              {points.map((point, index) => (
                <li key={index} className="flex items-center text-gray-100">
                  <FaCheckCircle className="text-blue-500 mr-3 text-lg flex-shrink-0" />
                  <span className="text-sm md:text-base font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="rounded-xl overflow-hidden border-2 border-gray-700 shadow-premium">
              <img 
                src={aboutImg} 
                alt="Car Cleaning Professional" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default WhyChouseUsComponents;
