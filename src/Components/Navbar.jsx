import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Logo/logo.png";
import { FiAlignJustify, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useBooking } from "../context/BookingContext";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useBooking();

  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 100; // Adjusted for floating navbar
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleNavigation = (sectionId) => {
    if (sectionId === "pricing") {
      navigate("/pricing");
      setIsNavOpen(false);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      localStorage.setItem("scrollToSection", sectionId);
    } else {
      handleScrollToSection(sectionId);
    }
    setIsNavOpen(false);
  };

  useEffect(() => {
    const sectionId = localStorage.getItem("scrollToSection");
    if (sectionId) {
      setTimeout(() => {
        handleScrollToSection(sectionId);
        localStorage.removeItem("scrollToSection");
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? "bg-[#050505]/90 backdrop-blur-md border-b border-white/5 py-2 md:py-3" : "bg-transparent py-4 md:py-6"}`}>
      <div className="w-[98%] max-w-7xl mx-auto">
        {/* Main Floating Pill */}
        <div
          className={`bg-[#18181b] rounded-[40px] p-2 md:p-2.5 flex justify-between items-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-gray-800 transition-all duration-300`}
        >
        {/* Left: Logo Section */}
        <div
          className="flex items-center gap-3 cursor-pointer group pl-1"
          onClick={() => handleNavigation("home")}
        >
          {/* White Circular Logo Container */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <img className="w-7 h-7 md:w-8 md:h-8 object-contain" src={img} alt="Car Clean Plus Logo" />
          </div>

          {/* Brand Name (Hidden on very small screens to save space) */}
          <div className="hidden sm:flex flex-col justify-center leading-none">
            <span className="text-lg md:text-xl font-bold tracking-tight text-white">
              Car Clean Plus
            </span>
            <span className="text-[8px] md:text-[9px] font-semibold text-gray-400 tracking-[0.2em] mt-1 uppercase">
              Clean Car, Happy You
            </span>
          </div>
        </div>

        {/* Middle: Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {["home", "about", "services", "pricing"].map((item) => (
            <button
              key={item}
              className="relative text-[15px] font-medium text-gray-300 hover:text-white transition-colors capitalize group py-2"
              onClick={() => handleNavigation(item)}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
            </button>
          ))}
        </nav>

        {/* Right: Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-4 pr-1">
          {/* Desktop WhatsApp Button */}
          <a
            href="https://wa.me/916392798847?text=Hi,%20I%20would%20like%20to%20book%20a%20car%20wash"
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden md:flex items-center gap-2 bg-white text-[#18181b] text-[14px] md:text-[15px] font-bold py-2 md:py-2.5 px-5 md:px-6 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm"
          >
            <FaWhatsapp className="text-[18px] text-green-500 group-hover:text-white transition-colors" />
            <span>Book on WhatsApp</span>
          </a>

          {/* Mobile WhatsApp Button Icon Only */}
          <a
            href="https://wa.me/916392798847?text=Hi,%20I%20would%20like%20to%20book%20a%20car%20wash"
            target="_blank"
            rel="noopener noreferrer"
            className="group md:hidden flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <FaWhatsapp className="text-xl text-green-500 group-hover:text-white transition-colors" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-xl text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          >
            {isNavOpen ? <FiX /> : <FiAlignJustify />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Floating card below pill) */}
      <div
        className={`lg:hidden absolute top-[calc(100%+10px)] left-0 w-full bg-[#18181b] rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden border border-gray-800 ${isNavOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 border-transparent"
          }`}
      >
        <div className="flex flex-col p-6 gap-2">
          {["home", "about", "services", "pricing"].map((item) => (
            <button
              key={item}
              className="text-left text-base font-medium text-gray-300 hover:text-white capitalize py-3 border-b border-gray-800/50"
              onClick={() => handleNavigation(item)}
            >
              {item}
            </button>
          ))}
          <a
            href="https://wa.me/916392798847?text=Hi,%20I%20would%20like%20to%20book%20a%20car%20wash"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsNavOpen(false)}
            className="group flex justify-center items-center gap-2 bg-white text-[#18181b] text-base font-bold py-3 px-6 rounded-full mt-4 hover:bg-red-600 hover:text-white transition-colors shadow-sm"
          >
            <FaWhatsapp className="text-xl text-green-500 group-hover:text-white transition-colors" /> Book on WhatsApp
          </a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
