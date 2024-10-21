import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/Logo/logo.png";
import { FiAlignJustify } from "react-icons/fi";
const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const handleOnGetInTouch = () => {
    router.push("#/contact");
  };
  return (
    <div className="flex flex-col justify-between  py-6 relative px-1 text-white bg-primary md:flex-row">
      <div className="flex  items-center gap-3">
        <div className="w-12 ml-5  lg:w-12 md:ml-12">
          <img className="bg-cover" src={img} alt="Logo" />
        </div>
        <div className="text-2xl font-bold md:text-3xl">Car Clean Plus</div>
      </div>
      <nav
        className={`pb-4 lg:flex pt-4 md:mt-0 mx-4 text-xl ${
          isNavOpen ? "flex" : "hidden"
        } flex-col md:flex-row gap-4 md:gap-12`}
      >
        <Link
          className="self-center transition duration-200 hover:text-blue-300"
          to="/"
        >
          Home
        </Link>
        <Link
          className="self-center transition duration-200 hover:text-blue-300"
          to="/about"
        >
          About
        </Link>
        <Link
          className="self-center transition duration-200 hover:text-blue-300"
          to="/ContactComponent"
        >
          Contact
        </Link>
        <Link
          className="self-center transition duration-200 hover:text-blue-300"
          to="/faq"
        >
          FAQ
        </Link>
        <Link
          className="self-center transition duration-200 hover:text-blue-300"
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>
        <button
          onClick={handleOnGetInTouch}
          className="bg-myyellow hover:bg-black text-white py-2 px-4 transition-all duration-300 rounded hover:text-mybg"
        >
          Get An Appointment
        </button>
      </nav>
      <div
        onClick={() => setIsNavOpen(!isNavOpen)}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 flex justify-center items-center text-2xl sm:hidden"
      >
        <FiAlignJustify />
      </div>
    </div>
  );
};
export default Navbar;
