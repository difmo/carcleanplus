import React, { useEffect } from "react";
import { FiClock, FiHelpCircle, FiMail, FiPhone } from "react-icons/fi";
import helpPhoto from "../../assets/wash car.png";

function HelpSupport() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    {
      q: "What services do you offer?",
      a: "We provide exterior washing, interior cleaning, detailing, and doorstep car care. Visit the packages section for the Basic, Premium, and Complete washes.",
    },
    {
      q: "How much water do you use for cleaning?",
      a: "We are committed to conserving water and use a foam wash that needs far less water than a bucket or garden hose.",
    },
    {
      q: "Can I book an appointment online?",
      a: "Yes. You can book a slot directly through this website using the booking form.",
    },
    {
      q: "What if it rains after my car is cleaned?",
      a: "Weather can affect a fresh wash. We recommend parking under cover when possible.",
    },
    {
      q: "Do you offer discounts for regular customers?",
      a: "Yes. Festival offers and repeat-customer discounts appear in the Offer section when they are active.",
    },
  ];

  return (
    <div className="bg-white min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F0FE] text-[#1D4ED8] text-xs font-bold uppercase tracking-wider mb-3">
            <FiHelpCircle />
            <span>Help & Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight">We are here to help</h1>
          <p className="text-[#6B7280] text-sm sm:text-base mt-3 max-w-2xl mx-auto">
            Car Clean Plus prioritizes customer satisfaction. Use this guide for bookings, service questions, and how to reach the team.
          </p>
        </div>

        <div className="photo-frame h-52 sm:h-72 mb-8">
          <img src={helpPhoto} alt="Doorstep car wash" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a href="tel:+919120759988" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 min-h-[40px]">
            <span className="icon-circle"><FiPhone /></span>
            <span>
              <span className="block text-sm font-bold text-[#111827]">Phone</span>
              <span className="block text-sm text-[#6B7280]">+91 91207 59988</span>
            </span>
          </a>
          <a href="mailto:carcleanplusofficial@gmail.com" className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 min-h-[40px]">
            <span className="icon-circle"><FiMail /></span>
            <span>
              <span className="block text-sm font-bold text-[#111827]">Email</span>
              <span className="block text-sm text-[#6B7280] break-all">carcleanplusofficial@gmail.com</span>
            </span>
          </a>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
            <span className="icon-circle"><FiClock /></span>
            <span>
              <span className="block text-sm font-bold text-[#111827]">Hours</span>
              <span className="block text-sm text-[#6B7280]">Mon – Sat, 8:00 AM – 8:00 PM</span>
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-[#111827] mb-2">Contact us</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Feedback and suggestions can be shared by phone or email. The customer team helps with bookings, reschedules, and service questions, and aims to reply to email within 24 hours.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#111827] mb-3">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-gray-100 p-4">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <span className="icon-circle w-9 h-9"><FiHelpCircle /></span>
                    {item.q}
                  </h3>
                  <p className="text-sm text-[#6B7280] mt-2 leading-relaxed pl-12">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#111827] mb-2">Service policies</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-2">
              <span className="font-bold text-[#111827]">Cancellation: </span>
              If you need to cancel or reschedule, tell us at least 2 hours before the slot.
            </p>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              <span className="font-bold text-[#111827]">Satisfaction guarantee: </span>
              If you are not satisfied, contact us the same day and the team will work to make it right.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#111827] mb-2">Feedback</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Suggestions about your visit are welcome by email or through the contact form on the homepage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpSupport;
