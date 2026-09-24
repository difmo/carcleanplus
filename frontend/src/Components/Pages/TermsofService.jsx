import React, { useEffect } from "react";
import { FaFileContract, FaCheckCircle, FaCar, FaClock, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

function TermsofService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Compact Hero Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0052cc] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <FaFileContract className="text-xs" />
            <span>Customer Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-blue-600">Service</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium max-w-lg mx-auto">
            Please read these terms and conditions carefully before booking doorstep car cleaning services with Car Clean Plus.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[11px] font-bold text-gray-400">
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              Effective Date: July 01, 2024
            </span>
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
              Last Updated: September 2026
            </span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.04)] p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed text-sm">

          {/* Section 1: Overview */}
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                01
              </div>
              <h2 className="text-lg font-black tracking-tight">Agreement to Terms</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              These Terms of Service constitute a legally binding agreement between you and Car Clean Plus 
              regarding your access to and use of our website and doorstep car detailing services. 
              By scheduling an appointment or using our services, you agree to comply with and be bound by these terms.
            </p>
          </div>

          {/* Section 2: Doorstep Service Scope */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                02
              </div>
              <h2 className="text-lg font-black tracking-tight">Doorstep Service & Requirements</h2>
            </div>
            <ul className="space-y-2.5 pl-10.5 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>Our mobile cleaning units operate within specified areas across Lucknow (Gomti Nagar, Indira Nagar, etc.).</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>The customer must provide reasonable access to the vehicle (parking space, gated community permission if required).</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>Customers are advised to remove valuables, cash, and personal belongings from the vehicle prior to cleaning.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Booking, Cancellation & Rescheduling */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                03
              </div>
              <h2 className="text-lg font-black tracking-tight">Booking, Rescheduling & Cancellations</h2>
            </div>
            <div className="pl-10.5 space-y-2 text-xs sm:text-sm text-gray-600">
              <p>
                Appointments can be booked online via our website or over the phone. 
                If you need to reschedule or cancel your appointment, please notify us at least 2 hours in advance. 
                In case of severe rain, storm, or technical issues, Car Clean Plus reserves the right to reschedule the slot with mutual consent.
              </p>
            </div>
          </div>

          {/* Section 4: Pricing & Payment */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                04
              </div>
              <h2 className="text-lg font-black tracking-tight">Pricing & Payment Policy</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              Service prices are displayed clearly based on car body category and chosen wash package. 
              We accept online payments (UPI, Cards, Netbanking via Razorpay) as well as Cash upon service delivery. 
              All payments are in Indian National Rupees (INR).
            </p>
          </div>

          {/* Section 5: Office Address & Support */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                05
              </div>
              <h2 className="text-lg font-black tracking-tight">Company Contact & Queries</h2>
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

export default TermsofService;
