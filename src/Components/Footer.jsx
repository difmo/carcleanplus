import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import img from "../assets/logo.png"; // Assuming this is the logo
import bgImage from "../assets/footer.jpg"; // Add your background image

const Footer = () => {
  return (
    <footer
      className="text-white relative overflow-hidden w-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-[#083248] bg-opacity-70 pt-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Logo and Description Section */}
            <div className="w-full flex flex-col items-center md:items-start">
              <img src={img} alt="Company Logo" className="h-12 w-12 mb-2" />
              <h3 className="text-sm sm:text-base lg:text-lg text-center md:text-left mt-4">
                Enhancing Customer Experience with Innovative Web and Mobile App
                Solutions
              </h3>
            </div>

            {/* Quick Links Section */}
            <div className="mb-8 sm:ml-8 md:ml-0">
              <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
                Quick Links
              </h2>
              <ul className="text-white font-medium">
                {[
                  "FAQ",
                  "Help & Support",
                  "Privacy Policy",
                  "Disclaimer",
                  "Terms of Service",
                ].map((link) => (
                  <li className="mb-1" key={link}>
                    <span className="hover:underline cursor-pointer text-sm">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information Section */}
            <div className="mb-6">
              <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
                Contact
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-2 flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2" />
                  <span>info@codeservir.com</span>
                </li>
                <li className="mb-1 flex items-center justify-center md:justify-start">
                  <FaPhoneAlt className="mr-1" />
                  <span>+91 945-579-1624</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>
                    4/37 Vibhav Khand, Gomti Nagar, Lucknow, Uttar Pradesh,
                    226010
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8">
            <p className="mt-4 text-white text-sm max-w-md text-center md:text-left">
              We Innovate, Coffee Helps! A team of mobility experts driven by an
              everlasting passion for app technology!
            </p>
            <div className="flex justify-center md:justify-start mt-4">
              <a
                href="https://www.youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-700 mx-2"
              >
                <IoLogoFacebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://www.youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-700 mx-2"
              >
                <IoLogoInstagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-700 mx-2"
              >
                <IoLogoYoutube size={24} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white  mt-10 mx-10 " />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center mx-10  md:justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left py-2">
            © 2023
            <a href="#" className="hover:underline ">
              CAR WASH
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
