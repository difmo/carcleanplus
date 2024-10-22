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
      <div className="shadow-2xl rounded-xl p-8 max-w-2xl w-full bg-slate-200">
        <h2 className="text-2xl font-bold text-center text-black">
          Contact Us
        </h2>
        <form ref={form} onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block font-semibold text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full text-black rounded-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block font-semibold text-black">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="mt-1 block w-full text-black rounded-sm"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block font-semibold text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full text-black rounded-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block font-semibold text-black">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full text-black rounded-sm"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>
          <div className="mb-2">
            <label className="block font-semibold text-black">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full text-black rounded-sm"
              rows="4"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-myyellow hover:bg-black text-white py-2 px-6 transition-all rounded  font-mono"
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
