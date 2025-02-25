import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

function FormContact() {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    mobileNumber: "",
    email: "",
    subject: "",
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
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.lastname.trim()) errors.lastname = "Last Name is required";
    if (!formData.mobileNumber.trim())
      errors.mobileNumber = "Mobile number is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.subject.trim())
      errors.subject = "Subject selection is required";
    if (!formData.message.trim()) errors.message = "Message is required";

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
        lastname: "",
        mobileNumber: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setStatus("Failed to send email. Please try again.");
      console.error("Email sending error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center px-2 sm:px-2 md:px-4">
      <div className="w-full  bg-white shadow-lg rounded-lg p-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-[#26baf6]">
          Contact Us
        </h2>
        <form ref={form} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border-b border-gray-600  px-4 text-gray-700 focus:outline-none "
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full border-b border-gray-600  px-4 text-gray-700 focus:outline-none "
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full border-b border-gray-600  px-4 text-gray-700 focus:outline-none "
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-sm">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-600  px-4 text-gray-700 focus:outline-none "
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Select Subject
            </label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["General Inquiry", "car Inquiry", "washing Inquiry", " Inquiry"].map((subject) => (
                <label key={subject} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="subject"
                    value={subject}
                    checked={formData.subject === subject}
                    onChange={handleChange}
                    className="form-radio text-blue-500  "
                  />
                  <span className="text-gray-700">{subject}</span>
                </label>
              ))}
            </div>
            {errors.subject && (
              <p className="text-red-500 text-sm">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border-b border-gray-600  px-4 text-gray-700 focus:outline-none  "
              rows="2"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 text-white font-bold bg-red-500 hover:bg-red-700 transition duration-300 rounded-md"
          >
            Submit
          </button>

          {/* Status Message */}
          {status && (
            <p className="mt-4 text-green-500 text-center">{status}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default FormContact;
