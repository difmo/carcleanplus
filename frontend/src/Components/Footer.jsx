import React from "react";
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp,
  FaClock, FaFacebookF, FaInstagram, FaYoutube,
  FaChevronRight, FaShieldAlt, FaLink, FaCar, FaArrowRight
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/logo car clean.png";
import footerBg from "../assets/footer.jpg";
import phoneImg from "../assets/Phone.png";
import playStoreBtn from "../assets/btn-play-store.webp";
import appStoreBtn from "../assets/btn-app-store.webp";
import premiumPhoneImg from "../assets/car_clean_plus_phone.jpg";
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
    { name: 'Our Process', action: (e) => handleNavigation(e, null, 'process') },
    { name: 'Packages & Pricing', action: (e) => handleNavigation(e, '/pricing', null) },
    { name: 'Gallery', action: (e) => handleNavigation(e, '/gallery', null) },
    { name: 'FAQ', action: (e) => handleNavigation(e, '/faq', null) },
  ];

  const packagesList = [
    { name: 'Basic Wash', action: (e) => handleNavigation(e, '/pricing', null) },
    { name: 'Premium Wash', action: (e) => handleNavigation(e, '/pricing', null) },
    { name: 'Complete Clean', action: (e) => handleNavigation(e, '/pricing', null) }
  ];

  return (
    <footer id="contact-us" className="w-full font-sans bg-white relative text-gray-800 border-t border-gray-200 mt-16 pt-4">

      {/* App Download Banner */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] w-full relative z-20 -mt-14 mb-4">
        <div className="relative overflow-hidden bg-[#0957cb] rounded-[20px] flex flex-row items-center shadow-lg min-h-[150px] md:min-h-[180px] py-4 md:py-0 px-2 md:px-8">
          
          {/* Premium AI Generated Phone Image */}
          <div className="relative z-10 w-[35%] md:w-[30%] h-full flex justify-end md:justify-center items-center">
            <div className="relative h-[130px] md:h-[180px] w-auto group overflow-hidden rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-[2px] border-white/10">
              <img 
                src={premiumPhoneImg} 
                alt="Premium App Preview" 
                className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
            </div>
          </div>

          {/* Text & Buttons Content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center pl-6 md:pl-10 py-2">
            <h2 className="text-[20px] md:text-[30px] font-extrabold text-white mb-1 leading-tight tracking-tight">
              Download Car Clean Plus App
            </h2>
            <p className="text-blue-100 text-[12px] md:text-[14px] mb-3 max-w-[450px] font-medium leading-snug hidden sm:block">
              Book your service in just a few taps and get exciting offers!
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-2">
              <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 opacity-60 grayscale-[50%] pointer-events-none">
                <img src={playStoreBtn} alt="Get it on Google Play" className="h-[28px] sm:h-[32px] md:h-[40px] object-contain rounded-md" />
                <img src={appStoreBtn} alt="Download on the App Store" className="h-[28px] sm:h-[32px] md:h-[40px] object-contain rounded-md" />
              </div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 border border-yellow-300 text-yellow-950 text-xs md:text-sm font-black px-5 py-2 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] tracking-widest uppercase transform hover:scale-105 transition-all animate-pulse">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                COMING SOON
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">

          {/* Column 1: Brand Info */}
          <div>
            <div className="flex flex-col mb-3">
              <img src={img} alt="Car Clean Plus" className="h-16 w-auto object-contain filter brightness-0 self-start -ml-2" />
              <p className="text-gray-800 text-xs leading-relaxed mt-2 font-medium">
                Car Clean Plus provides premium car wash & detailing services at your doorstep.
              </p>
            </div>
            
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full border border-gray-400 hover:border-[#1877F2] hover:text-white hover:bg-[#1877F2] transition-colors text-gray-700">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="p-2 rounded-full border border-gray-400 hover:border-[#E1306C] hover:text-white hover:bg-[#E1306C] transition-colors text-gray-700">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="p-2 rounded-full border border-gray-400 hover:border-[#FF0000] hover:text-white hover:bg-[#FF0000] transition-colors text-gray-700">
                <FaYoutube size={14} />
              </a>
              <a href="https://wa.me/919120759988?text=Hi" className="p-2 rounded-full border border-gray-400 hover:border-[#25D366] hover:text-white hover:bg-[#25D366] transition-colors text-gray-700">
                <FaWhatsapp size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-lg tracking-wide mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <a href="#" onClick={link.action} className="text-gray-700 hover:text-primary text-sm transition-colors font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Packages */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-lg tracking-wide mb-3">Our Packages</h4>
            <ul className="space-y-1.5">
              {packagesList.map(pkg => (
                <li key={pkg.name}>
                  <a href="#" onClick={pkg.action} className="text-gray-700 hover:text-[#0052cc] text-sm transition-colors font-medium">
                    {pkg.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-lg tracking-wide mb-3">Contact Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.google.com/maps/search/Lucknow,+Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group cursor-pointer text-gray-700">
                  <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-500" size={16} />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">123, Sector 45, Noida,<br/>Uttar Pradesh - 201301</span>
                </a>
              </li>
              <li>
                <a href="tel:+919120759988" className="flex items-center gap-3 group cursor-pointer text-gray-700">
                  <FaPhoneAlt className="flex-shrink-0 text-gray-500" size={14} />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">+91 91207 59988</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@carcleanplus.com" className="flex items-center gap-3 group cursor-pointer text-gray-700">
                  <FaEnvelope className="flex-shrink-0 text-gray-500" size={14} />
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">info@carcleanplus.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <FaClock className="flex-shrink-0 text-gray-500" size={14} />
                <span className="text-sm font-medium">Mon - Sun: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full border-t border-gray-200 bg-white relative z-10">
        <div className="mx-auto px-4 max-w-6xl py-3 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Car Clean Plus. All Rights Reserved. <span className="hidden md:inline mx-2">|</span> <br className="md:hidden" /> Merchant ID: TPb4N2383whw9M</p>

          <div className="flex items-center gap-2 text-gray-400">
            <FaCar className="text-blue-500 text-xl" />
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
