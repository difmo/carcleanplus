import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Logo/logo.png";
import { FiAlignJustify, FiX } from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import { useBooking } from "../context/BookingContext";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useBooking();

  const navItems = [
    { name: "Home" },
    { name: "Services" },
    { name: "Packages" },
    { name: "How It Works" },
    { name: "Gallery" },
    { name: "Contact Us" }
  ];

  // Handle scroll effect and active section
  useEffect(() => {
    // If on separate pages, set active section based on URL
    if (location.pathname === '/gallery') {
      setActiveSection('Gallery');
      const handleBasicScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleBasicScroll);
      return () => window.removeEventListener("scroll", handleBasicScroll);
    }
    
    if (location.pathname === '/pricing') {
      setActiveSection('Packages');
      const handleBasicScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleBasicScroll);
      return () => window.removeEventListener("scroll", handleBasicScroll);
    }

    // Home page scroll tracking
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      let current = 'Home';
      const sections = ['home', 'services', 'how-it-works', 'contact-us'];
      
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            if (sec === 'home') current = 'Home';
            if (sec === 'services') current = 'Services';
            if (sec === 'how-it-works') current = 'How It Works';
            if (sec === 'contact-us') current = 'Contact Us';
          }
        }
      }

      // If at the very bottom, highlight Contact Us
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'Contact Us';
      }

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavigation = (sectionName) => {
    if (sectionName === "Gallery") {
      navigate("/gallery");
      setIsNavOpen(false);
      return;
    }

    if (sectionName === "Packages") {
      navigate("/pricing");
      setIsNavOpen(false);
      return;
    }

    const targetId = sectionName.toLowerCase().replace(/ /g, '-');
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => handleScrollToSection(targetId), 100);
    } else {
      handleScrollToSection(targetId);
    }
    setIsNavOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled ? "bg-[#040914]/95 backdrop-blur-lg border-b border-white/5 shadow-lg" : "bg-[#040914] border-b border-white/5"}`}>
      <div className="w-[98%] max-w-[1400px] mx-auto flex justify-between items-center px-4 h-[80px]">
        
        {/* Left: Logo Section */}
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavigation("Home")}
        >
          {/* Circular Logo */}
          <div className="w-10 h-10 md:w-11 md:h-11 bg-primary rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-1">
            <img className="w-full h-full object-contain filter brightness-0 invert" src={img} alt="Logo" />
          </div>

          {/* Brand Name */}
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-[20px] md:text-[22px] font-bold tracking-tight text-white flex items-center gap-1.5">
              Car Clean <span className="text-primary font-bold">Plus</span>
            </span>
            <span className="text-[8px] md:text-[9px] font-bold text-[#888] tracking-[0.2em] mt-0.5 uppercase">
              Clean Car, Happy You
            </span>
          </div>
        </div>

        {/* Middle: Desktop Menu */}
        <nav className="hidden xl:flex flex-none justify-center items-center gap-7 2xl:gap-9 h-full">
          {navItems.map((item) => {
            const isActive = activeSection === item.name;
            return (
              <button
                key={item.name}
                className={`relative h-full flex items-center gap-1.5 text-[13px] 2xl:text-[14px] font-semibold transition-colors capitalize group ${isActive ? 'text-primary' : 'text-[#d1d5db] hover:text-white'
                  }`}
                onClick={() => handleNavigation(item.name)}
              >
                <div className="relative inline-flex flex-col items-center justify-center">
                  <span>{item.name}</span>
                  {/* Active Line */}
                  <span className={`absolute -bottom-[8px] h-[3px] rounded-full bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0'
                    }`}></span>
                </div>
                {item.badge && (
                  <span className="bg-[#10b981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] leading-none mb-0.5 ml-0.5">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Action Buttons & Mobile Toggle */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {/* Phone Number (Desktop) */}
          <a
            href="tel:+919120759988"
            className="hidden lg:flex items-center gap-2.5 border border-[#333] bg-transparent text-gray-200 text-[13px] md:text-[14px] font-semibold py-2.5 px-4 rounded-lg hover:border-[#555] hover:text-white hover:bg-white/5 transition-all"
          >
            <FaPhoneAlt className="text-gray-400 text-[12px]" />
            <span>+91 91207 59988</span>
          </a>

          {/* Book a Wash Button */}
          <button
            onClick={openModal}
            className="hidden md:flex items-center justify-center bg-[#0052cc] text-white text-[13px] md:text-[14px] font-bold py-2.5 px-6 rounded-lg hover:bg-[#0043a8] transition-colors"
          >
            Book a Wash
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="xl:hidden w-10 h-10 flex items-center justify-center text-xl text-white hover:bg-[#222] rounded-lg transition-colors focus:outline-none border border-[#333]"
          >
            {isNavOpen ? <FiX /> : <FiAlignJustify />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`xl:hidden absolute top-full left-0 w-full bg-[#040914] shadow-2xl transition-all duration-300 overflow-hidden border-b border-[#222] ${isNavOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent"
          }`}
      >
        <div className="flex flex-col p-4 md:p-6 gap-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center justify-between text-left text-base font-semibold capitalize py-3 px-4 rounded-lg transition-colors ${activeSection === item.name ? 'text-primary bg-primary/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              onClick={() => handleNavigation(item.name)}
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="bg-[#10b981] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#222] px-4">
            <a
              href="tel:+919120759988"
              className="flex justify-center items-center gap-2 border border-[#333] text-gray-200 text-base font-medium py-3 px-6 rounded-lg hover:bg-white/5 transition-colors"
            >
              <FaPhoneAlt className="text-gray-400" />
              <span>+91 91207 59988</span>
            </a>
            <button
              onClick={() => {
                setIsNavOpen(false);
                openModal();
              }}
              className="flex justify-center items-center gap-2 bg-[#0052cc] text-white text-base font-bold py-3 px-6 rounded-lg hover:bg-[#0043a8] transition-colors"
            >
              Book a Wash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
