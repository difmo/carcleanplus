import React from "react";
import { 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp, 
  FaClock, FaFacebookF, FaInstagram, FaYoutube, 
  FaChevronRight, FaShieldAlt, FaLink, FaCar, FaArrowRight
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/logo car clean.png";
import footerBg from "../assets/footer.jpg"; 
import washCarImg from "../assets/wash car.png";
import { useBooking } from "../context/BookingContext";

const Footer = () => {
  const { openModal } = useBooking();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavigation = (e, path, sectionId) => {
    e.preventDefault();
    if (path) {
      navigate(path);
      window.scrollTo(0, 0);
    } else if (sectionId) {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => handleScrollToSection(sectionId), 100);
      } else {
        handleScrollToSection(sectionId);
      }
    }
  };

  const quickLinks = [
    { name: 'Home', action: (e) => handleNavigation(e, '/', null) },
    { name: 'About Us', action: (e) => handleNavigation(e, null, 'about') },
    { name: 'Services', action: (e) => handleNavigation(e, null, 'services') },
    { name: 'Packages & Pricing', action: (e) => handleNavigation(e, null, 'services') },
    { name: 'Gallery', action: (e) => handleNavigation(e, '/gallery', null) },
    { name: 'Contact Us', action: (e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); } }
  ];

  return (
    <footer className="w-full font-sans bg-[#050b14] relative text-gray-300 border-t border-gray-900 mt-20 pt-10">

      {/* Background Image Overlay (Right side car fade) */}
      <div
        className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          maskImage: 'linear-gradient(to right, transparent, black)',
          WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black)'
        }}
      ></div>

      {/* Floating CTA Banner */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20 -mt-28 mb-16">
        <div className="relative overflow-hidden bg-[#050505] rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-gray-800/80">
          
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img src={washCarImg} alt="Car Wash" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#050505]/95 to-[#050505]"></div>
          </div>

          <div className="flex items-center gap-5 relative z-10 w-full lg:w-auto">
            <div className="bg-[#0f0f0f] p-4 md:p-5 rounded-2xl flex-shrink-0 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <FaPhoneAlt className="text-3xl text-white" />
            </div>
            <div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                Need a <span className="text-green-500">Car Wash</span>?
              </h3>
              <p className="text-gray-400 text-sm md:text-base font-medium mb-3">We are just a call or message away!</p>
              <div className="h-1 w-12 bg-green-500 rounded-full"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
            <a 
              href="tel:+916392798847" 
              className="flex items-center justify-center gap-4 px-6 py-4 bg-[#0a0a0a] hover:bg-[#111] text-white rounded-2xl transition-all duration-300 border border-gray-800 hover:border-gray-600 group"
            >
              <div className="w-10 h-10 rounded-full bg-black border border-gray-800 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
                <FaPhoneAlt className="text-sm text-green-500" />
              </div>
              <div className="text-left pr-2">
                <p className="text-[10px] text-green-500 uppercase tracking-[0.2em] font-bold leading-none mb-1.5">Call Us</p>
                <p className="font-bold text-base md:text-lg leading-tight tracking-wide">+91 63927 98847</p>
              </div>
            </a>
            
            <button 
              onClick={openModal} 
              className="flex items-center justify-between gap-6 px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-green-400/30 group"
            >
              <div className="flex items-center gap-4">
                <FaWhatsapp className="text-3xl md:text-4xl" />
                <div className="text-left">
                  <p className="font-bold text-base md:text-lg leading-none mb-1.5">Book on WhatsApp</p>
                  <p className="text-[11px] text-green-100 font-medium tracking-wide">Quick & Easy Booking</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <FaArrowRight className="text-white text-sm" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={img} alt="Car Clean Plus" className="h-14 w-auto object-contain" />
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide leading-none mb-1">Car Clean Plus</h3>
                <p className="text-[10px] text-blue-500 tracking-widest uppercase font-bold">Clean Car, Happy You</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We provide professional doorstep car cleaning services in Lucknow. Your car's care, our responsibility.
            </p>

            <div className="flex gap-3 mb-8">
              <a href="#" className="p-2.5 rounded-full border border-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors text-gray-400">
                <FaFacebookF size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-gray-700 hover:border-pink-500 hover:text-pink-500 transition-colors text-gray-400">
                <FaInstagram size={16} />
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }} className="p-2.5 rounded-full border border-gray-700 hover:border-green-500 hover:text-green-500 transition-colors text-gray-400">
                <FaWhatsapp size={16} />
              </a>
              <a href="#" className="p-2.5 rounded-full border border-gray-700 hover:border-red-500 hover:text-red-500 transition-colors text-gray-400">
                <FaYoutube size={16} />
              </a>
            </div>

            {/* Trusted Badge */}
            <div className="bg-[#0f172a] rounded-xl p-4 flex items-center gap-4 border border-gray-800 shadow-md">
              <FaShieldAlt className="text-3xl text-blue-500" />
              <div>
                <p className="text-white font-bold text-sm">Trusted by 1000+ Customers</p>
                <p className="text-gray-400 text-[11px] mt-1">Premium Service Guaranteed</p>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-800/50 rounded-lg text-blue-500 border border-gray-800"><FaLink size={14} /></div>
                <h4 className="text-white font-bold text-base tracking-widest uppercase">Quick Links</h4>
              </div>
              <div className="h-1 w-8 bg-blue-600 rounded-full ml-12"></div>
            </div>

            <ul className="space-y-4">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <a href="#" onClick={link.action} className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-3">
                    <FaChevronRight className="text-blue-600 text-[10px]" /> {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Service Areas */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-800/50 rounded-lg text-blue-500 border border-gray-800"><FaMapMarkerAlt size={14} /></div>
                <h4 className="text-white font-bold text-base tracking-widest uppercase">Service Areas</h4>
              </div>
              <div className="h-1 w-8 bg-blue-600 rounded-full ml-12"></div>
            </div>

            <ul className="space-y-4">
              {['Gomti Nagar', 'Indira Nagar', 'Jankipuram', 'Aliganj', 'Hazratganj', 'Other Areas in Lucknow'].map(area => (
                <li key={area} className="text-gray-400 text-sm flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-600 text-[10px]" /> {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-800/50 rounded-lg text-blue-500 border border-gray-800"><FaPhoneAlt size={14} /></div>
                <h4 className="text-white font-bold text-base tracking-widest uppercase">Contact Us</h4>
              </div>
              <div className="h-1 w-8 bg-blue-600 rounded-full ml-12"></div>
            </div>

            <ul className="space-y-6">
              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-800/50 rounded-full border border-gray-700 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500 transition-colors flex-shrink-0">
                  <FaPhoneAlt size={16} />
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider">Call Us</p>
                  <a href="tel:+916392798847" className="text-gray-300 hover:text-blue-400 text-sm font-medium transition-colors">+91 63927 98847</a>
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-800/50 rounded-full border border-gray-700 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500 transition-colors flex-shrink-0">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider">Email Us</p>
                  <a href="mailto:carcleanplusofficial@gmail.com" className="text-gray-300 hover:text-blue-400 text-sm font-medium break-all transition-colors">carcleanplusofficial@gmail.com</a>
                </div>
              </li>

              <li className="flex items-center gap-4 group cursor-pointer">
                <a href="https://www.google.com/maps/search/Lucknow,+Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-800/50 rounded-full border border-gray-700 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500 transition-colors flex-shrink-0 block">
                  <FaMapMarkerAlt size={16} />
                </a>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider">Our Location</p>
                  <a href="https://www.google.com/maps/search/Lucknow,+Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 text-sm font-medium transition-colors">Lucknow, Uttar Pradesh</a>
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="p-3 bg-gray-800/50 rounded-full border border-gray-700 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500 transition-colors flex-shrink-0">
                  <FaClock size={16} />
                </div>
                <div>
                  <p className="text-gray-500 text-[11px] uppercase tracking-wider">Working Hours</p>
                  <p className="text-gray-300 text-sm font-medium">Mon - Sun : 8:00 AM - 8:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-800 bg-[#03060a] py-6 relative z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2025 Car Clean Plus. All Rights Reserved. <span className="hidden md:inline mx-2">|</span> <br className="md:hidden" /> Merchant ID: TPb4N2383whw9M
          </p>

          <div className="flex items-center gap-2 text-gray-400">
            <FaCar className="text-blue-500 text-xl" />
            <span className="text-sm font-medium">Clean Car. <span className="text-blue-500">Happy You.</span></span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">|</span>
            <Link to="/termsofservice" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
