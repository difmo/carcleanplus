import React from "react";
import img from "../assets/about/car-image.png";
import car from "../assets/about/wash.png";
import Button from "./Button";

const About = () => {
  return (
    <section
      id="about"
      className="relative bg-no-repeat bg-cover bg-center mt-[520px] md:mt-0 lg:mt-0"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="bg-black bg-opacity-80 py-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <h2 className="text-center font-mono text-2xl md:text-3xl text-mywhite pb-5">
          About Us
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={car}
              alt="Car"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="font-sans text-base sm:text-lg md:text-xl text-white leading-relaxed px-2">
              Car Clean Plus is Lucknow's trusted name in professional car
              cleaning and washing services. We specialize in high-quality
              exterior and interior cleaning, ensuring your vehicle stays
              spotless and well-maintained. Our services include doorstep car
              cleaning and regular maintenance packages, providing convenience
              and reliability. Using advanced cleaning techniques and
              eco-friendly products, we deliver top-notch results with every
              wash. Whether you need a quick wash or deep detailing, our skilled
              team guarantees excellent service and customer satisfaction. At
              Car Clean Plus, we make car care effortless, reliable, and
              affordable. Book your service today!
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <Button />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
