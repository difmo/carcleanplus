import React from "react";
import img from "../assets/about/car-image.png";
import img1 from "../assets/Svg/Vector.svg";
import Button from "./Button";
import car from "../assets/about/wash.png";
import HeaderCard from "./Cardheader";
const About = () => {
  return (
    <>
      <div  id="about"
        className="section bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${img})`,
        }}
      >
        {/* <div className="relative bg-black bg-opacity-80 ">
          <img src={img1} alt="" />
          <div className="relative z-10 bottom-[12rem] md:bottom-[40rem]">
            <HeaderCard />
          </div>
        </div> */}
        

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
                A clean car is a happy car. Who doesn't want to drive a clean
                car? At DAILY CARWASH, we aim to change the previous car washing
                concept where car owners had to deal with inconvenient,
                untrained, and unprofessional people to get their prized
                possession clean and protected. Daily Carwash is a
                ground-breaking step in the car cleaning sector, providing the
                best car cleaning service at your doorstep with the right
                equipment by highly trained professionals.
              </p>
              <div className="py-4" >
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
