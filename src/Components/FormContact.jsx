import React, { useState } from "react";

function FormContact() {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    let errors = {};
    if (formData.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (formData.mobileNumber.trim() === "") {
      errors.mobileNumber = "Mobile number is required";
    }
    if (formData.email.trim() === "") {
      errors.email = "Email is required";
    }
    if (formData.message.trim() === "") {
      errors.message = "Message is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Process form submission (e.g., send data to backend)
    console.log("Form submitted:", formData);

    // Clear form fields
    setFormData({
      name: "",
      mobileNumber: "",
      email: "",
      message: "",
    });

    // Clear errors
    setErrors({});
  };

  return (
    <div className="flex flex-col md:flex-row mx-auto p-4">
      <div className="w-full  p-4">
        <h2 className="text-2xl md:text-2xl font-bold mb-4 text-center md:text-left">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl md:text-3xl font-semibold text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm md:text-xl">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-2xl md:text-4xl font-semibold text-gray-700">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm md:text-xl">
                {errors.mobileNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-2xl md:text-4xl font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm md:text-xl">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-2xl md:text-4xl font-semibold text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
              rows="4"
            />
            {errors.message && (
              <p className="text-red-500 text-sm md:text-xl">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="hidden md:block md:w-1/2 p-4"></div>
    </div>
  );
}

export default FormContact;
