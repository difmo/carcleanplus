import React, { useState, useEffect } from "react";
import { 
  FaQuestionCircle, FaChevronDown, FaPhoneAlt, 
  FaEnvelope, FaCar, FaClock, FaCheckCircle 
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { useBooking } from "../../context/BookingContext";

const FAQ_DATA = [
  {
    category: "Services & Quality",
    items: [
      {
        q: "What is included in Car Clean Plus doorstep car detailing?",
        a: "Our doorstep detailing packages range from Exterior Foam Wash to 360° Deep Interior Detailing. It includes high-pressure foam wash, alloy wheel cleaning, deep interior vacuuming, dashboard conditioning, foot-mat scrub, AC vent sanitization, and high-gloss protective waxing."
      },
      {
        q: "Do I need to supply water or heavy electricity?",
        a: "Our technicians arrive with professional mobile equipment and high-pressure water-saving machinery. We only require a regular household water tap connection. Our advanced foam-lance technology consumes up to 80% less water than conventional bucket or garden-pipe washing."
      },
      {
        q: "Which areas in Lucknow do you provide service to?",
        a: "We currently provide doorstep service across all prime locations in Lucknow including Gomti Nagar, Gomti Nagar Extension, Sushant Golf City, Vibhuti Khand, Indira Nagar, Mahanagar, Aliganj, and Jankipuram / Extension."
      }
    ]
  },
  {
    category: "Booking & Timings",
    items: [
      {
        q: "What are your working days and service hours?",
        a: "We operate Monday to Saturday from 8:00 AM to 8:00 PM. We offer 6 convenient daily time slots (starting from 08:30 AM to 04:30 PM) so you can pick the exact time that suits your schedule."
      },
      {
        q: "How long does a doorstep cleaning session take?",
        a: "A Basic Foam Wash takes about 30–40 minutes, a Premium Wash takes 45–60 minutes, and our Complete Interior + Exterior Deep Detailing Spa takes between 60 to 90 minutes."
      },
      {
        q: "Can I reschedule or cancel my booking?",
        a: "Yes! You can reschedule or cancel your slot free of charge by calling our customer care at least 2 hours before the scheduled appointment."
      }
    ]
  },
  {
    category: "Payment & Guarantee",
    items: [
      {
        q: "What payment methods are accepted?",
        a: "We accept Cash on Service Delivery, all UPI apps (Google Pay, PhonePe, Paytm), and instant online card/netbanking payments via Razorpay on our website."
      },
      {
        q: "Is there a satisfaction guarantee?",
        a: "Absolutely! We offer a 100% Satisfaction Guarantee. If you notice any missed spot or are unsatisfied with the finish, our technician will re-clean it on the spot free of charge."
      }
    ]
  }
];

function Faq() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { openModal } = useBooking();
  // Store open item key as `${categoryIndex}-${itemIndex}`
  const [openItem, setOpenItem] = useState("0-0");

  const toggleAccordion = (key) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50/50 via-white to-gray-50 min-h-screen pt-32 sm:pt-36 md:pt-40 pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Compact Hero Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-[#0052cc] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <HiSparkles className="text-xs" />
            <span>Got Questions? We've Got Answers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] to-blue-600">Questions</span>
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium max-w-lg mx-auto">
            Everything you need to know about our professional doorstep car cleaning, packages, and booking process in Lucknow.
          </p>
        </div>

        {/* FAQ Accordion Groups */}
        <div className="space-y-6 mb-12">
          {FAQ_DATA.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,82,204,0.04)] overflow-hidden p-5 sm:p-7">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#0052cc] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0052cc]"></span>
                {group.category}
              </h2>

              <div className="divide-y divide-gray-100">
                {group.items.map((item, itemIdx) => {
                  const itemKey = `${groupIdx}-${itemIdx}`;
                  const isOpen = openItem === itemKey;

                  return (
                    <div key={itemIdx} className="py-3.5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(itemKey)}
                        className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                      >
                        <span className={`text-sm sm:text-[15px] font-bold transition-colors ${
                          isOpen ? 'text-[#0052cc]' : 'text-gray-900 group-hover:text-[#0052cc]'
                        }`}>
                          {item.q}
                        </span>
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen ? 'bg-blue-50 text-[#0052cc] rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                        }`}>
                          <FaChevronDown className="text-xs" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pl-1 pr-6 animate-fade-in">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Help CTA Card */}
        <div className="bg-gradient-to-r from-blue-900 to-[#0052cc] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 text-white text-xl">
              <FaQuestionCircle />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Still have a question?</h3>
              <p className="text-blue-100 text-xs mt-0.5">We're available Mon - Sat (8 AM - 8 PM) to assist you.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <a
              href="tel:+919120759988"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <FaPhoneAlt className="text-xs" />
              <span>Call Us</span>
            </a>

            <button
              type="button"
              onClick={() => openModal()}
              className="px-5 py-2.5 bg-white text-[#0052cc] font-black text-xs rounded-xl hover:bg-blue-50 transition-all shadow-md cursor-pointer"
            >
              Book Doorstep Wash
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Faq;
