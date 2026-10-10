import React, { useState, useRef } from "react";
import { FiMail, FiMessageCircle, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { BASE_URL } from "../utils/api";

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

    // Send data to backend API
    try {
      // Map frontend fields to backend fields
      const payload = {
        name: `${formData.name.trim()} ${formData.lastname.trim()}`,
        email: formData.email.trim(),
        phone: formData.mobileNumber.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      };

      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("Form submitted successfully!");
        setFormData({
          name: "",
          lastname: "",
          mobileNumber: "",
          email: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        setStatus(data.message || "Failed to submit form. Please try again.");
      }
    } catch (error) {
      setStatus("Failed to submit form. Please try again.");
      console.error("Form submission error:", error);
    }
  };

  const fieldClass = "w-full min-h-[44px] border border-gray-200 rounded-2xl pl-10 pr-3 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-[#1D4ED8] bg-white";

  return (
    <div className="w-full">
      <h2 className="text-2xl font-black text-[#111827] mb-1 flex items-center gap-2">
        <span className="icon-circle"><FiMessageCircle /></span>
        Send a message
      </h2>
      <p className="text-sm text-[#6B7280] mb-5">We reply on the same business day whenever we can.</p>
      <form ref={form} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1D4ED8]" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={fieldClass} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Last Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1D4ED8]" />
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} className={fieldClass} />
            </div>
            {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Mobile Number</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1D4ED8]" />
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className={fieldClass} />
            </div>
            {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1D4ED8]" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={fieldClass} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111827] mb-2">Select Subject</label>
          <div className="flex flex-wrap gap-2">
            {["General Inquiry", "car Inquiry", "washing Inquiry", " Inquiry"].map((subject) => (
              <label key={subject} className="inline-flex items-center gap-2 min-h-[40px] px-3 rounded-full border border-gray-200 text-sm text-[#111827]">
                <input
                  type="radio"
                  name="subject"
                  value={subject}
                  checked={formData.subject === subject}
                  onChange={handleChange}
                  className="text-[#1D4ED8]"
                />
                <span>{subject}</span>
              </label>
            ))}
          </div>
          {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-[#111827] mb-1">Message</label>
          <div className="relative">
            <FiMessageCircle className="absolute left-3 top-3 text-[#1D4ED8]" />
            <textarea name="message" value={formData.message} onChange={handleChange} className={`${fieldClass} min-h-[96px] py-3`} rows="3" />
          </div>
          {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
        </div>

        <button type="submit" className="btn-primary w-full">
          <FiSend />
          Submit
        </button>

        {status && (
          <p className="text-sm text-center text-[#111827]">{status}</p>
        )}
      </form>
    </div>
  );
}

export default FormContact;
