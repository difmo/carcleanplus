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
                  CarCleanPlus transforms car cleaning with vocal washing
                  technology, allowing you to schedule, customize, and track
                  washes with just your voice. Whether it is a quick refresh or
                  a thorough cleaning, our hands-free service ensures that your
                  vehicle stays in pristine condition effortlessly and reliably.
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
