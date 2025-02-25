import React from "react";
import FormContact from "./FormContact";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";

function ContactComponent() {
  return (
    <div id="contact" className="container mx-auto px-4 py-10">
      {/* Heading Section */}
      <div className="text-center py-10">
        <h1 className="text-3xl md:text-4xl font-bold py-2 text-gray-900">
          Contact Us
        </h1>
        <p className="text-gray-600 text-md md:text-base py-2">
          Any questions or remarks? Just write us a message!
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Section */}
        <div className="bg-[#0b1c2b] text-white py-16 px-6 md:px-12 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
          <p className="text-gray-400 mb-6">
            Say something to start a live chat!
          </p>

          <div className="space-y-6 self-center pt-16">
            {/* Phone */}
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-[#26baf6] text-lg" />
              <span className="text-gray-300">+91 63927 98847</span>
            </div>

            {/* Email */}
            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-[#26baf6] text-lg" />
              <span className="text-gray-300">
                carcleanplusofficial@gmail.com
              </span>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <FaMapLocation className="text-[#26baf6] text-lg" />
              <span className="text-gray-300">Office Spane </span>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div>
          <FormContact />
        </div>
      </div>
    </div>
  );
}

export default ContactComponent;
