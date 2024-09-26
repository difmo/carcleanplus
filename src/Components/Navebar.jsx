import React from "react";
import { Link } from "react-router-dom";
import img from "../assets/logo.png";

const Navbar = () => {
  return (
    <div className="bg-[rgb(0,69,120)] text-white flex flex-col md:flex-row justify-between p-4">
      <div className="flex items-center gap-3">
        <img className="h-16 w-16 md:h-20 md:w-20 ml-10" src={img} alt="Logo" />
        <div className="text-3xl md:text-4xl font-bold">CarcleanWash</div>
      </div>
      <nav className="mt-4 md:mt-4 mx-20 text-2xl md:text-4xl flex flex-col md:flex-row gap-12">
        <Link className="hover:text-blue-300 transition duration-200" to="/">
          Home
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200"
          to="about"
        >
          About
        </Link>
        <Link
          className="hover:text-blue-300 transition duration-200"
          to="contact"
        >
          Contact
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
