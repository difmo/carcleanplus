import React from "react";
import img from "../assets/about/car-image.png";
import img1 from "../assets/Svg/Vector.svg";
import Button from "./Button";
import car from "../assets/about/wash.png";
import HeaderCard from "./Cardheader";
const About = () => {
  return (
    <>
      <div
        id="about"
        className="section bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${img})`,
        }}
      >
        <div className="bg-cover bg-center bg-black bg-opacity-80">
          <div className="justify-center">
            <div className=" font-mono text-2xl md:text-3xl py-5 text-mywhite  flex justify-center">
              About Us
            </div>
            <div className="sm:px-5 md:flex md:mx-0">
              <div className=" lg:w-1/2 self-center mb-5 md:mb-0 w-full h-full  ">
                <img src={car} alt="Car" className="object-cover " />
              </div>
              <div className="w-full lg:w-1/2 md:mx-1 md:pb-5">
                <p className="font-sans text-lg md:text-xl text-white  px-3 ">
                  Car Clean Plus is Lucknow's trusted name in professional car
                  cleaning and washing services. We specialize in high-quality
                  exterior and interior cleaning, ensuring your vehicle stays
                  spotless and well-maintained. Our services include doorstep
                  car cleaning and regular maintenance packages, providing
                  convenience and reliability. Using advanced cleaning
                  techniques and eco-friendly products, we deliver top-notch
                  results with every wash. Whether you need a quick wash or deep
                  detailing, our skilled team guarantees excellent service and
                  customer satisfaction. At Car Clean Plus, we make car care
                  effortless, reliable, and affordable. Book your service today!
                </p>
                <div className="py-4 px-20">
                  <Button />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
