import React from "react";
import img from "../assets/car1.jpg";
import img1 from "../assets/car4.jpeg";
import img2 from "../assets/car3.webp";
import img3 from "../assets/home1.png";
import Button from "./Button";
import HeaderCard from "./Cardheader";

const About = () => {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(${img})`,
        }}
      >
        <div className="relative bg-black bg-opacity-80">
          <div className="bg-myyellow relative z-10 bottom-[15rem]">
            <HeaderCard />
          </div>

          {/* Rotate yellow color only at the bottom */}
          <div
            className="absolute bottom-0 left-0 w-full -top-6 h-64 bg-myyellow transform origin-bottom"
            style={{ transform: "rotate(-6deg)" }}
          ></div>
        </div>

        <div className="bg-cover bg-center bg-black bg-opacity-80">
          <div className="text-center font-bold text-4xl md:text-6xl py-5 text-white">
            About Us
          </div>
          <div className="px-5 md:flex md:mx-20">
            <div className="md:w-1/2 self-center mb-5 md:mb-0">
              <img
                src="src/assets/carslider.jpg"
                alt="Car"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="md:w-1/2 md:mx-10 pb-5">
              <h1 className="text-2xl md:text-4xl font-medium text-white">
                Lorem
              </h1>
              <p className="font-sans text-lg md:text-xl text-white p-1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex,
                animi? Illum deleniti ullam quia quisquam aut, omnis similique!
                Consequatur, error eligendi officiis blanditiis expedita
                inventore provident odit amet culpa dolores quisquam, numquam
                harum consectetur quam. Qui illo mollitia quas aperiam!
              </p>
              <Button />
            </div>
          </div>
        </div>
      </div>

      {/* Uncomment this section for more content */}
      {/* <div className="w-full h-auto">
        <div className="text-center font-bold text-4xl md:text-7xl pt-10 px-5 md:px-30">
          Door step car cleaning service at an affordable cost
        </div>

        <div className="md:flex p-5 md:p-10">
          <div className="w-full md:w-1/2 px-5 md:px-20 pt-10 md:pt-20 text-base md:text-xl leading-8 font-serif">
            A clean car is a happy car. Who doesn't want to drive a clean car?
            At DAILY CARWASH, we aim to change the previous car washing concept
            where car owners had to deal with inconvenient, untrained, and
            unprofessional people to get their prized possession clean and
            protected. Daily Carwash is a ground-breaking step in the car
            cleaning sector, providing the best car cleaning service at your
            doorstep with the right equipment by highly trained professionals.
          </div>
          <div className="w-full md:w-auto mt-5 md:mt-0">
            <img src={img} className="w-full md:h-[500px] object-cover" alt="Car" />
          </div>
        </div>

        <div className="md:flex p-5 md:p-10">
          <div className="w-full md:w-auto mt-5 md:mt-0">
            <img src={img2} className="w-full md:h-[500px] object-cover" alt="Car" />
          </div>
          <div className="w-full md:w-1/2 px-5 md:px-20 pt-10 md:pt-20 text-base md:text-xl leading-8 font-serif">
            <div className="font-bold text-2xl md:text-3xl">Mission :</div>
            Best quality car cleaning on a daily basis and guaranteed customer
            satisfaction. Convenience of our customers is our priority, whether
            it's the time of cleaning, payment mode, or frequency. We prioritize
            the customer with eco-friendly car cleaning practices using top
            quality car care products.
          </div>
        </div>

        <div className="md:flex p-5 md:p-10">
          <div className="w-full md:w-1/2 px-5 md:px-20 pt-10 md:pt-20 text-base md:text-xl leading-8 font-serif">
            <div className="font-bold text-2xl md:text-3xl">Vision :</div>
            We are committed to providing our customers with a Happy Car every
            day by offering a daily car cleaning service using top quality
            products and professional services.
          </div>
          <div className="w-full md:w-auto mt-5 md:mt-0">
            <img src={img1} className="w-full md:h-[500px] object-cover" alt="Car" />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default About;
