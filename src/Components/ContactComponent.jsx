import React from "react";

function ContactComponent() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-around w-full">
        {/* Google Map Section */}
        <div className="w-full md:w-1/2">
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

        {/* Contact Information Section */}
        <div className="w-full md:w-1/2 bg-opacity-95 leading-10 bg-[#333532] pt-10 md:pt-16 text-white">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold">Contact Information</h2>
            <p>Email: example@example.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Address: 123 Main Street, City, Country</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactComponent;
