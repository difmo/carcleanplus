import React from "react";
import Button from "./Button"; // Ensure you import your Button component
import backgroundImage from "../assets/home1.png"; // Import the background image

const HowCanHelpComponent = () => {
  return (
    <div
      className="relative  bg-centerbg-no-repeat bg-cover bg-center pt-10"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
      }}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      {/* Content wrapper */}
      <div className="relative px-4 sm:px-8 lg:px-12 py-6 flex flex-col justify-center items-center  ">
        {/* Heading */}
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
          <h1>How can We Help?</h1>
        </div>

        {/* Subheading */}
        <div className="text-lg sm:text-xl lg:text-2xl text-white text-center mb-4">
          <h3>Get Special Offer Today</h3>
        </div>

        {/* Paragraph */}
        <div className="text-white text-center mb-8 px-4 sm:px-6 lg:px-8 max-w-2xl">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
            pariatur numquam magnam ipsa nam repudiandae explicabo quos atque,
            praesentium sunt?
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <Button />
        </div>
      </div>
    </div>
  );
};

export default HowCanHelpComponent;

// import React, { useState } from "react";
// import img from "../assets/car1.jpg";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     mobileNumber: "",
//     email: "",
//     message: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.mobileNumber) {
//       newErrors.mobileNumber = "Mobile number is required";
//     } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
//       newErrors.mobileNumber = "Mobile number must be 10 digits";
//     }
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
//     if (!formData.message) newErrors.message = "Message is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       console.log("Form submitted:", formData);
//       setFormData({ name: "", mobileNumber: "", email: "", message: "" });
//       setErrors({});
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row  mx-auto p-4">
//       <div className="w-full md:w-1/2 p-4">
//         <h2 className="text-2xl md:text-6xl font-bold mb-4 text-center md:text-left">Contact Us</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-xl md:text-3xl font-semibold text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded p-2"
//             />
//             {errors.name && <p className="text-red-500 text-sm md:text-xl">{errors.name}</p>}
//           </div>
//           <div className="mb-4">
//             <label className="block text-2xl md:text-4xl font-semibold text-gray-700">Mobile Number</label>
//             <input
//               type="text"
//               name="mobileNumber"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded p-2"
//             />
//             {errors.mobileNumber && (
//               <p className="text-red-500 text-sm md:text-xl">{errors.mobileNumber}</p>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-2xl md:text-4xl font-semibold text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded p-2"
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm md:text-xl">{errors.email}</p>
//             )}
//           </div>
//           <div className="mb-4">
//             <label className="block text-2xl md:text-4xl font-semibold text-gray-700">Message</label>
//             <textarea
//               name="message"
//               value={formData.message}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded p-2"
//               rows="4"
//             />
//             {errors.message && (
//               <p className="text-red-500 text-sm md:text-xl">{errors.message}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
//           >
//             Submit
//           </button>
//         </form>
//       </div>
//       <div className="hidden md:block md:w-1/2 p-4">
//         <img
//           src={img}
//           alt="Contact Us"
//           className="w-full h-full object-cover rounded-lg shadow-lg"
//         />
//       </div>
//     </div>
//   );
// };

// export default Contact;
