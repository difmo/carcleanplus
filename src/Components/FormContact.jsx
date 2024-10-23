import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

function FormContact() {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    // Validation
    if (formData.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (formData.mobileNumber.trim() === "") {
      errors.mobileNumber = "Mobile number is required";
    }
    if (formData.email.trim() === "") {
      errors.email = "Email is required";
    }
    if (formData.address.trim() === "") {
      errors.address = "Address is required";
    }
    if (formData.message.trim() === "") {
      errors.message = "Message is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Send email using EmailJS
    try {
      await emailjs.sendForm(
        "service_wkqr4cr",
        "template_j4ol4sh",
        form.current,
        "Df3qo6O7hmYaucU8m"
      );
      setStatus("Email sent successfully!");
      setFormData({
        name: "",
        mobileNumber: "",
        email: "",
        address: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setStatus("Failed to send email. Please try again.");
      console.error("Email sending error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      {/* Card Form Container */}
      <div className="w-full  md:px-20 p-4 mb-4  md:p-10 bg-contactbg bg-cover bg-center hover:bg-[#ffffff] duration-500 rounded-lg shadow-md">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 font-lilita text-[#26baf6]">
          Contact Us
        </h2>
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-600 ml-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="appearance-none border rounded-xl w-full py-4 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-600 ml-1">
              Mobile Number
            </label>
            <input
              type="number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="appearance-none border rounded-xl w-full py-4 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-600 ml-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="appearance-none border rounded-xl w-full py-4 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-600 ml-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="appearance-none border rounded-xl w-full py-4 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-sm font-bold text-gray-600 ml-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="appearance-none border rounded-xl w-full py-4 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
              rows="4"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full p-5 py-2 text-white transition duration-300 font-bold bg-black rounded-lg btn2 hover:bg-myyellow hover:text-black"
            // className="bg-myyellow hover:bg-black text-white py-2 px-6 transition-all rounded  font-mono"
          >
            Send
          </button>
          {status && <p className="mt-4 text-green-500">{status}</p>}
        </form>
      </div>
    </div>
  );
}

export default FormContact;
