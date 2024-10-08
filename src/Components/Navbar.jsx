import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/logo.png";
import { BsHammer } from "react-icons/bs";
import { FaHamburger, FaHammer } from "react-icons/fa";
import { FaAlgolia, FaHand } from "react-icons/fa6";
import { FiAlignJustify } from "react-icons/fi";

const Navbar = () => {
  const [isNavOpen, setIsnavOpen] = useState(false);

  return (
    <div
      className="bg-primary  text-white flex flex-col md:flex-row justify-between py-2 
    "
    >
      <div className="flex items-center gap-3">
        <img className="h-10 w-8 lg:h-12 lg:w-12  md:ml-10" src={img} alt="Logo" />
        <div className="text-xl md:text-3xl font-bold">CarcleanWash</div>
      </div>
      {/* {isNavOpen ? ( */}
      <nav
        className={`pb-4 lg:flex  pt-4 md:mt-0 mx-2  text-xl ${
          isNavOpen ? "flex" : "hidden"
        } flex-col md:flex-row gap-4 md:gap-12`}
      >
        <Link
          className="hover:text-blue-300 transition duration-200 self-center"
          to="/"
        >
          Home
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200  self-center"
          to="/about"
        >
          About
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200  self-center"
          to="/contact"
        >
          Contact
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200  self-center"
          to="/faq"
        >
          FAQ
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200  self-center"
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>

        <button className="self-center   rounded-xl bg-blue-600 text-white p-2">
          Get An Appointment
        </button>
      </nav>
      {/* ) : ( */}
      <div
        onClick={() => setIsnavOpen(!isNavOpen)}
        className="sm:hidden text-2xl flex absolute right-0 top-10"
      >
        <FiAlignJustify className="flex absolute bottom-0 right-0" />
      </div>
      {/* )} */}
    </div>
  );
};

export default Navbar;
