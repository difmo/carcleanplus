import React from "react";
import Button from "./Button"; // Ensure you import your Button component
import backgroundImage from "../assets/home1.png"; // Import the background image

const HowCanHelpComponent = () => {
  return (
    <div
    className="relative bg-center bg-no-repeat bg-cover pt-10"
    style={{
      backgroundImage: `url(${backgroundImage})`, // Set the background image
    }}
  >
    {/* Black overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-80"></div>
  
    {/* Content wrapper */}
    <div className="relative px-4 sm:px-8 lg:px-12 py-6 flex flex-col justify-center items-center">
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
