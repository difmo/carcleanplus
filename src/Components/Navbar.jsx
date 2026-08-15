import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Logo/logo.png";
import { FiAlignJustify } from "react-icons/fi";
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
      const headerOffset = 85; // Fixed navbar height offset
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
      handleScrollToSection(sectionId);
      localStorage.removeItem("scrollToSection");
    }
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${isScrolled || isNavOpen
          ? "bg-white/95 backdrop-blur-xl border-gray-200/80 shadow-sm py-2"
          : "bg-white/80 backdrop-blur-md border-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavigation("home")}>
          <img className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105" src={img} alt="Car Clean Plus Logo" />
          <div className="flex flex-col justify-center leading-none">
            <span className="text-xl md:text-2xl font-bold tracking-tight text-primary">
              Car Clean Plus
            </span>
            <span className="text-[9px] font-semibold text-accent tracking-[0.2em] mt-1 uppercase">
              Clean Car, Happy You
            </span>
          </div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-10">
          {["home", "about", "services", "pricing"].map((item) => (
            <button
              key={item}
              className="relative text-[15px] font-medium text-gray-600 hover:text-primary transition-colors capitalize group py-2"
              onClick={() => handleNavigation(item)}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="https://wa.me/916392798847?text=Hi,%20I%20would%20like%20to%20book%20a%20car%20wash"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-[15px] font-bold py-2.5 px-6 rounded-full hover:from-green-600 hover:to-green-700 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/30"
          >
            <FaWhatsapp className="text-[18px]" /> Book on WhatsApp
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="lg:hidden text-2xl text-primary p-2 focus:outline-none"
        >
          <FiAlignJustify />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-hidden ${isNavOpen ? "max-h-[400px] border-t border-gray-100 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {["home", "about", "services", "pricing"].map((item) => (
            <button
              key={item}
              className="text-left text-base font-medium text-gray-700 hover:text-accent capitalize py-2 border-b border-gray-100"
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
            className="flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-base font-bold py-3 px-6 rounded-full mt-4 hover:from-green-600 hover:to-green-700 transition-all shadow-md"
          >
            <FaWhatsapp className="text-xl" /> Book on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
