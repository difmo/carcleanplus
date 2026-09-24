import React, { useEffect } from "react";
import { 
  FaShieldAlt, FaLock, FaUserCheck, FaDatabase, 
  FaEnvelope, FaMapMarkerAlt, FaFileContract, FaCheckCircle 
} from "react-icons/fa";

function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Compact Hero Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0052cc] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <FaShieldAlt className="text-xs" />
            <span>Trust & Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-blue-600">Policy</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium max-w-lg mx-auto">
            Learn how Car Clean Plus collects, uses, and protects your personal information when you use our doorstep detailing services.
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

          {/* Section 1: Introduction */}
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                01
              </div>
              <h2 className="text-lg font-black tracking-tight">Introduction & Commitment</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              Car Clean Plus ("We", "Us", or "Our") is dedicated to protecting and respecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information 
              when you visit our website, book our doorstep wash services, or communicate with us. 
              By using our services, you consent to the data practices described in this document.
            </p>
          </div>

          {/* Section 2: Information We Collect */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                02
              </div>
              <h2 className="text-lg font-black tracking-tight">Information We Collect</h2>
            </div>
            <div className="space-y-3 pl-10.5 text-xs sm:text-sm text-gray-600">
              <p>We may collect personal details necessary to schedule and fulfill doorstep car wash requests:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="font-bold text-gray-900 block text-xs mb-1">Customer Identifiers</span>
                  <span className="text-[12px] text-gray-500">Full Name, 10-digit Mobile Number, Email Address.</span>
                </div>
                <div className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <span className="font-bold text-gray-900 block text-xs mb-1">Service & Vehicle Details</span>
                  <span className="text-[12px] text-gray-500">Car make/model, body category, doorstep address in Lucknow, appointment date & slot.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: How We Use Your Data */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                03
              </div>
              <h2 className="text-lg font-black tracking-tight">How We Use Your Data</h2>
            </div>
            <ul className="space-y-2 pl-10.5 text-xs sm:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>To dispatch trained car cleaning technicians directly to your specified address.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>To send appointment confirmations, reminder SMS/WhatsApp notifications, and receipts.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>To respond to your inquiries, customer support questions, and service feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <FaCheckCircle className="text-emerald-500 text-xs mt-1 shrink-0" />
                <span>To prevent fraudulent activities and ensure safe, verified payment processing.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Data Protection & Sharing */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                04
              </div>
              <h2 className="text-lg font-black tracking-tight">Zero Selling & Secure Storage</h2>
            </div>
            <div className="pl-10.5 space-y-2 text-xs sm:text-sm text-gray-600">
              <p>
                <strong>We NEVER rent, sell, or trade your personal data.</strong> Your information is stored on 
                secure, encrypted databases protected by modern industry security standards. 
                Information is only shared with trusted payment infrastructure (Razorpay) strictly to process your transactions.
              </p>
            </div>
          </div>

          {/* Section 5: Your Rights */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                05
              </div>
              <h2 className="text-lg font-black tracking-tight">Your Rights & Control</h2>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm pl-10.5">
              You retain full rights to request access, correction, or deletion of your personal records from our database. 
              If you wish to update your details or request data deletion, simply send an email request to our support desk.
            </p>
          </div>

          {/* Section 6: Office & Contact Info */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 mb-3 text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052cc] flex items-center justify-center text-xs font-black shrink-0">
                06
              </div>
              <h2 className="text-lg font-black tracking-tight">Grievance & Contact Information</h2>
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

export default PrivacyPolicy;
