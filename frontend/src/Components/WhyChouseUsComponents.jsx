import React from "react";
import { FaCheckCircle, FaArrowRight, FaShieldAlt } from "react-icons/fa";
import aboutImg from "../assets/about5.png";
import { useNavigate } from "react-router-dom";

function WhyChouseUsComponents() {
  const navigate = useNavigate();

  const points = [
    "Trained & Verified Professionals",
    "Advanced Equipment & Techniques",
    "Premium Quality Products",
    "On-time Service & Affordable Pricing",
  ];

  return (
    <section id="service" className="py-20 bg-white relative font-sans z-10">
      <div className="container mx-auto px-4 max-w-[1150px]">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-[#0033cc] font-bold text-[12px] tracking-widest uppercase mb-3">
              WHY CHOOSE US
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] leading-[1.1] mb-5 tracking-tight">
              We Care For Your Car <br className="hidden lg:block" /> Like It's Our Own
            </h2>
            <p className="text-gray-500 text-[15px] mb-8 leading-relaxed font-medium max-w-[90%]">
              At Car Clean Plus, we use the best products and techniques to give your car the care it deserves. Your satisfaction is our priority.
            </p>

            <ul className="space-y-4 mb-10">
              {points.map((point, index) => (
                <li key={index} className="flex items-center text-[#0a192f] font-semibold text-[14px]">
                  <FaCheckCircle className="text-[#0033cc] text-[20px] mr-3 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            <div>
              <button onClick={() => {
                const section = document.getElementById("services");
                if (section) section.scrollIntoView({ behavior: "smooth" });
              }} className="bg-[#0033cc] hover:bg-[#002299] text-white font-bold text-sm py-3 px-6 rounded-lg flex items-center gap-3 transition-colors shadow-md hover:shadow-lg w-fit">
                Know More About Us
                <div className="border border-white/40 rounded-full p-1 flex items-center justify-center">
                  <FaArrowRight className="text-[10px] text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] h-[350px] md:h-[400px]">
              <img src={aboutImg} alt="Why Choose Us" className="w-full h-full object-cover object-center" />
            </div>

            {/* Satisfaction Badge */}
            <div className="absolute -bottom-8 lg:-bottom-10 right-4 lg:right-[-2rem] bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-4 md:p-6 flex items-center gap-4 z-20 border border-gray-50">
              <span className="text-[#0033cc] font-extrabold text-[40px] leading-none tracking-tighter">100%</span>
              <div className="flex flex-col flex-1 pl-4 border-l-[1.5px] border-gray-100">
                <span className="text-[#0a192f] text-[13px] font-semibold leading-tight">Satisfaction</span>
                <span className="text-[#0a192f] text-[13px] font-semibold leading-tight">Guaranteed</span>
              </div>
              <div className="w-[42px] h-[42px] bg-[#f0f4ff] rounded-xl flex items-center justify-center shrink-0 ml-2">
                <FaShieldAlt className="text-[#0033cc] text-[20px]" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default WhyChouseUsComponents;
