import React from "react";
import FormContact from "./FormContact";

function ContactComponent() {
  return (
    <>
      <div
        id="contact"
        className="section flex flex-col md:flex-row w-full bg-opacity-95 leading-10 bg-[#333532] text-white"
      >
        {/* Contact Form Section */}
        <div className="w-full md:w-1/2 p-4">
          <FormContact />
        </div>
        <div className="text-center w-full md:w-1/2 flex flex-col justify-center p-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Contact Information
          </h2>
          <p className="mb-2">Email :- carcleanplus@gmail.com</p>
          <p className="mb-2">Phone :- +91 63927 98847</p>
          <p>
            Address :- 4/37 Vibhav Khand, Gomti Nagar, Lucknow, Uttar Pradesh,
            226010
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full">
        <div className="w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.407556134766!2d80.99795561500742!3d26.864396283147847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2fd4c935a1f%3A0x81c66f667d01cf69!2sVibhav%20Khand%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%20226010!5e0!3m2!1sen!2sin!4v1696693058831!5m2!1sen!2sin"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </>
  );
}

export default ContactComponent;
