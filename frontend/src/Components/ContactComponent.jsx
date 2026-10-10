import React from "react";
import FormContact from "./FormContact";
import { FiClock, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import contactPhoto from "../assets/about section .jpeg";

function ContactComponent() {
  return (
    <div id="contact" className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-[#111827]">Contact Us</h2>
        <p className="text-[#6B7280] text-sm md:text-base mt-2">
          Any questions or remarks? Just write us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="photo-frame h-48">
            <img src={contactPhoto} alt="Car Clean Plus team" />
          </div>
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-extrabold text-[#111827]">Contact Information</h3>
            <a href="tel:+919120759988" className="flex items-center gap-3 min-h-[40px] text-[#111827]">
              <span className="icon-circle"><FiPhone /></span>
              <span className="text-sm font-semibold">+91 91207 59988</span>
            </a>
            <a href="mailto:carcleanplusofficial@gmail.com" className="flex items-center gap-3 min-h-[40px] text-[#111827]">
              <span className="icon-circle"><FiMail /></span>
              <span className="text-sm font-semibold break-all">carcleanplusofficial@gmail.com</span>
            </a>
            <div className="flex items-center gap-3 text-[#111827]">
              <span className="icon-circle"><FiClock /></span>
              <span className="text-sm font-semibold">Mon - Sat: 8:00 AM - 8:00 PM</span>
            </div>
            <div className="flex items-start gap-3 text-[#111827]">
              <span className="icon-circle"><FiMapPin /></span>
              <span className="text-sm text-[#6B7280] leading-relaxed">
                <strong className="text-[#111827]">Office Address:</strong><br />
                3rd Floor, 4/37 Vibhav Khand, near Mantri Awas Colony, Gomti Nagar, Lucknow, Uttar Pradesh 226010
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
          <FormContact />
        </div>
      </div>
    </div>
  );
}

export default ContactComponent;
