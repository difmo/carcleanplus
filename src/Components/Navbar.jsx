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
      className="flex flex-col justify-between py-2 text-white bg-primary md:flex-row "
    >
      <div className="flex items-center gap-3">
        <img className="w-8 h-10 lg:h-12 lg:w-12 md:ml-10" src={img} alt="Logo" />
        <div className="text-xl font-bold md:text-3xl">CarcleanWash</div>
      </div>
      {/* {isNavOpen ? ( */}
      <nav
        className={`pb-4 lg:flex  pt-4 md:mt-0 mx-2  text-xl ${
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

        <button className="self-center p-2 text-white bg-blue-600 rounded-xl">
          Get An Appointment
        </button>
      </nav>
      {/* ) : ( */}
      <div
        onClick={() => setIsnavOpen(!isNavOpen)}
        className="absolute right-0 flex text-2xl sm:hidden top-10"
      >
        <FiAlignJustify className="absolute bottom-0 right-0 flex" />
      </div>
      {/* )} */}
    </div>
  );
};

export default Navbar;
