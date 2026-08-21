import React from "react";
import Button from "./Button";
import backgroundImage from "../assets/home1.png";
const HowCanHelpComponent = () => {
  return (
    <div
      className="relative bg-center bg-no-repeat bg-cover pt-10"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      <div className="relative px-4 sm:px-8 lg:px-12 py-6 flex flex-col justify-center items-center">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
          <h1>How can We Help?</h1>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl text-white text-center mb-4">
          <h3>Get Special Offer Today</h3>
        </div>
        <div className="text-white  py-2 px-4 sm:px-6 lg:px-8 font-sans">
          <h1 className="text-xl font-mono">Bad Techniques</h1>
          <p>
            Unprofessional people will harm your beloved car. We have
            experienced this because more than 80% of the vehicles we attend
            have DIRTY CLOTH ROLL MARKS created by those without knowledge of
            CAR WASHING and end up scratching the Paints and damaging the shine
            of your car. We at INFINITY WASH have the BEST-IN-CLASS techniques
            from Gentle washing to Removing these kinds of Marks. Give your
            vehicle a chance to experience the BEST WASH your vehicle can even
            have, and after that you won't stop calling us again and again.
          </p>

        </div>
        <div className="text-white  py-2 px-4 sm:px-6 lg:px-8 font-sans">
          <h1 className="text-xl font-mono">Wrong Products</h1>
          <p>
          Cars are being cared for just like humans. Like humans have products that suit them, Cars also have products that suit their body and are best to apply frequently. Many people commonly use different kinds of shampoos and soaps to wash their car these products contain Anti-biological products that may suit your skin but harm the car, and this results in DULLNESS & SWRILL MARKS on the car just within 6 months of regular practice. Experience the power of INFINITY WASH, Our products are eco-friendly and interior products are all organic. Organic products are the best-suited products for EVERY CAR. They help in maintaining the shine on the CAR making your car feel brand new.</p>
        </div>
        <div className="text-white  py-2 px-4 sm:px-6 lg:px-8 font-sans">
          <h1 className="text-xl font-mono" > Water Wastage</h1>
          <p>
        
Did you know that washing a family car with buckets or pipes uses about 125 gallons of water? That’s enough water to sustain a person for a year or fill a municipal tank! In ultra-rural areas, people travel 10 km just to fetch daily water. Don’t waste this precious resource. Water is the next gold.

At INFINITY WASH, we only use 20 litres of water to clean a car efficiently. Want proof? Try us and see how we save water while delivering a spotless clean!</p>
        </div>
        
        <div className="flex justify-center">
          <Button />
        </div>
      </div>
    </div>
  );
};
export default HowCanHelpComponent;
