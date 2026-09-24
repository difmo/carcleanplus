import React, { useEffect } from "react";
import { FaExclamationTriangle, FaShieldAlt, FaCar, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

function Disclaimer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Compact Hero Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0052cc] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <FaExclamationTriangle className="text-xs" />
            <span>Service Disclaimer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-blue-600">Disclaimer</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium max-w-lg mx-auto">
            At Car Clean Plus, we are committed to delivering eco-friendly, premium doorstep car cleaning while conserving water and protecting your vehicle.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] font-bold text-gray-400">
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              Effective Date: July 01, 2024
            </span>
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              Car Clean Plus • Lucknow
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.04)] p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Section 1: Pre-existing Damage */}
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                01
              </div>
              <h2 className="text-lg font-black tracking-tight">Pre-existing Damage & Wear</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              Car Clean Plus takes utmost care of every vehicle. However, we cannot be held responsible 
              for pre-existing scratches, dents, faded paint, loose trim, or existing mechanical/electrical faults. 
              Customers are encouraged to inspect the vehicle alongside our technician prior to starting the wash.
            </p>
          </div>

          {/* Section 2: Custom & Aftermarket Modifications */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                02
              </div>
              <h2 className="text-lg font-black tracking-tight">Custom Modifications & Wraps</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              If your vehicle has custom wraps, repainted panels, tint films, or non-factory accessories, 
              please notify our team before service begins so that appropriate gentle techniques can be utilized.
            </p>
          </div>

          {/* Section 3: Valuables in Vehicle */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                03
              </div>
              <h2 className="text-lg font-black tracking-tight">Personal Valuables & Belongings</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              Please remove all cash, jewelry, high-value electronics, and important documents from the car glovebox 
              and cabin before our team begins interior vacuuming and steam cleaning.
            </p>
          </div>

          {/* Section 4: Water & Eco Conservation */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                04
              </div>
              <h2 className="text-lg font-black tracking-tight">Eco-Friendly Water Conservation</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              We employ professional foam-lance water-saving techniques and biodegradable cleaning formulas designed 
              to save over 80% water compared to traditional bucket and garden-hose washing methods.
            </p>
          </div>

          {/* Section 5: Office & Contact */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                05
              </div>
              <h2 className="text-lg font-black tracking-tight">Contact & Questions</h2>
            </div>
            
            <div className="pl-10.5 mt-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-gray-700">
                <FaMapMarkerAlt className="text-[#0052cc] text-sm shrink-0 mt-0.5" />
                <span>
                  <strong>Office Address:</strong> 3rd Floor, 4/37 Vibhav Khand, near Mantri Awas Colony, Gomti Nagar, Lucknow, Uttar Pradesh 226010
                </span>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-gray-700">
                <FaEnvelope className="text-[#0052cc] text-sm shrink-0" />
                <span>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:carcleanplusofficial@gmail.com" className="text-[#0052cc] font-bold hover:underline">
                    carcleanplusofficial@gmail.com
                  </a>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Disclaimer;
