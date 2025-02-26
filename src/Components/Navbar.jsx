import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import img from "../assets/Logo/logo.png";
import { FiAlignJustify } from "react-icons/fi";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to scroll smoothly to a section
  const handleScrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle navigation and scroll
  const handleNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      localStorage.setItem("scrollToSection", sectionId); // Save section ID
    } else {
      handleScrollToSection(sectionId);
    }
    setIsNavOpen(false); // Close menu after navigation
  };

  // Scroll to section after navigation
  useEffect(() => {
    const sectionId = localStorage.getItem("scrollToSection");
    if (sectionId) {
      handleScrollToSection(sectionId);
      localStorage.removeItem("scrollToSection");
    }
  }, [location.pathname]);

  return (
    <div
      className={`flex flex-col justify-between md:py-0 py-4 px-1 text-white absolute z-10 md:flex-row w-full top-0 transition-all duration-300 ${
        location.pathname !== "/" || isNavOpen ? "bg-gray-900" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 ml-5 lg:w-12 md:ml-12">
          <img className="bg-cover" src={img} alt="Logo" />
        </div>
        <div className="text-2xl font-bold md:text-3xl text-[#4dbecc]">
          Car Clean Plus
        </div>
      </div>

      {/* Navigation Links */}
      <nav
        className={`pb-4 lg:flex pt-4 md:mt-0 mx-4 text-xl ${
          isNavOpen ? "flex bg-gray-900 p-4 rounded-md" : "hidden"
        } flex-col md:flex-row gap-4 md:gap-12`}
      >
        <button
          className="self-center transition duration-200 hover:text-blue-300"
          onClick={() => handleNavigation("home")}
        >
          Home
        </button>
        <button
          className="self-center transition duration-200 hover:text-blue-300"
          onClick={() => handleNavigation("about")}
        >
          About
        </button>
        <button
          className="self-center transition duration-200 hover:text-blue-300"
          onClick={() => handleNavigation("contact")}
        >
          Contact
        </button>

        <button
          onClick={() => handleNavigation("contact")}
          className="bg-red-500 py-2 px-2 transition-all duration-300 rounded-md hover:bg-black hover:text-mywhite"
        >
          Get An Appointment
        </button>
      </nav>

      {/* Mobile Menu Toggle Button */}
      <div
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="absolute right-5 top-12 transform -translate-y-1/2 flex justify-center items-center text-2xl sm:hidden cursor-pointer"
      >
        <FiAlignJustify />
      </div>
    </div>
  );
};

export default Navbar;
