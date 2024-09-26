import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // Import other icons if needed
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import img from "../assets/logo.png";


const Footer = () => {
  return (
 
    <footer className="bg-[rgb(0,69,120)] text-white relative overflow-hidden w-full font-poppins pt-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <img
              src={img}
              alt="Company Logo"
              className="m-5 w-28 h-28 object-cover sticky bottom-2"
            />
            <h3>
              Enhancing Customer Experience with Innovative Web and Mobile App
              Solutions
            </h3>
          </div>
          <div className="mb-8 ml-24">
            <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
              Quick Links
            </h2>
            <ul className="text-white font-medium">
              {["FAQ","Help & Support","Terms and Conditions", "Privacy Policy","Disclaimer","Terms of Service"].map((link) => (
                <li className="mb-1" key={link}>
                  <span className="hover:underline cursor-pointer text-sm">
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
              Contact
            </h2>
            <ul className="text-white font-medium">
              <li className="mb-2 flex items-center">
                <FaEnvelope className="mr-2" />
                <span>info@codeservir.com</span>
              </li>
              <li className="mb-1 flex items-center">
                <FaPhone className="mr-1" />
                <span>+91 945-579-1624</span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  4/37 Vibhav Khand Gomti Nagar, Lucknow, Uttar Pradesh, 226010
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-around mr-36 flex-col md:flex-row">
          <p className="mt-4 text-white text-sm max-w-md mx-auto md:mx-0">
            We Innovate, Coffee Helps! A team of mobility experts driven by an
            everlasting passion for app technology!
          </p>
          <div className="flex justify-center md:justify-start rounded-md mt-4">
          <a
              href="https://www.youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-700 dark:hover:text-white mx-2"
            >
              <IoLogoFacebook size={24} />
              <span className="sr-only">YouTube</span>
            </a>
            <a
              href="https://www.youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-700 dark:hover:text-white mx-2"
            >
              <IoLogoInstagram  size={24} />
              <span className="sr-only">YouTube</span>
            </a>
            <a
              href="https://www.youtube.com/your-channel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-700 dark:hover:text-white mx-2"
            >
              <IoLogoYoutube size={24} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>
      <hr className="border-gray-600 lg:my-8 my-8 mx-10" />
      <div className="flex mx-10 flex-col-reverse my-8 items-center justify-center sm:flex-row sm:items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400 sm:text-center mb-4 sm:mb-0">
          © 2023{" "}
          <a href="#" className="hover:underline">
            CAR WASH
          </a>
          . All Rights Reserved.
        </span>
      </div>
 
    </footer>
  );
};

export default Footer;
