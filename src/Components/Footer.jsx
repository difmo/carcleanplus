import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoLogoFacebook, IoLogoInstagram, IoLogoYoutube } from "react-icons/io";
import img from "../assets/Logo/logo.png";
import bgImage from "../assets/footer.jpg";
const handleFAQClick = () => {
  navigate("/");
  setTimeout(() => handleScrollToSection("faq"), 0);
};
const Footer = () => {
  return (
    <footer>
      <div className="bg-black pt-5">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="w-full flex flex-col items-center md:items-start">
              <img src={img} alt="Company Logo" className="h-12 w-12 " />
              <h3 className="text-sm sm:text-base lg:text-lg text-center md:text-left mt-4 text-white">
                Enhancing Customer Experience with Innovative Web and Mobile App
                Solutions
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-center ">
                <div className="flex justify-center md:justify-start mt-4">
                  <a
                    href="https://www.facebook.com/carcleanplusofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 mx-2"
                  >
                    <IoLogoFacebook size={60} />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/carcleanplus_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 mx-2"
                  >
                    <IoLogoInstagram size={60} />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@carcleanplus/featured"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 mx-2"
                  >
                    <IoLogoYoutube size={60} />
                    <span className="sr-only">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="">
              <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
                Quick Links
              </h2>
              <ul className="text-white font-medium">
                {[
                  { name: "FAQ", url: "/faq" },
                  { name: "Help & Support", url: "/helpsupport" },
                  { name: "Privacy Policy", url: "/privacy-policy" },
                  { name: "Disclaimer", url: "/disclaimer" },
                  { name: "Terms of Service", url: "/termsofservice" },
                ].map((link) => (
                  <li className="mb-1" key={link.name}>
                    <a
                      href={link.url}
                      className="hover:underline cursor-pointer text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h2 className="mb-4 text-sm font-semibold uppercase underline text-white">
                Contact
              </h2>
              <ul className="text-white font-medium">
                <li className="mb-2 flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2" />
                  <span>carcleanplusofficial@gmail.com</span>
                </li>
                <li className="mb-2 flex items-center justify-center md:justify-start">
                  <FaPhoneAlt className="mr-2" />
                  <span> +91 63927 98847</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <FaMapMarkerAlt className=" mb-6 " />
                  <span>Office Space</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-white  mt-5 mx-10 " />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center mx-10  md:justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left py-2">
            © 2025
            <a href="#" className="hover:underline ">
              CAR CLEAN PLUS
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
