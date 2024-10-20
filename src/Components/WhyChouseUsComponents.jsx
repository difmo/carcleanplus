import React from "react";

import { FaCalendarCheck, FaCarAlt, FaCaravan } from "react-icons/fa";
import img5 from "../assets/car.jpg";
import { Fa42Group, FaCarOn } from "react-icons/fa6";
const mydata = [
  {
    key: 1,
    icon: <FaCarAlt />,
    title: "Quality Service",
    descri:
      "We pride ourselves on delivering exceptional quality in every wash. Our team uses top-of-the-line cleaning products that are safe for your vehicle’s finish. ",
  },
  {
    key: 2,
    icon: <FaCalendarCheck />,
    title: "Quality Service",
    descri:
      "Our staff is composed of trained professionals with extensive experience in car care.hey understand the specific needs of different vehicles. ",
  },
  {
    key: 3,
    icon: <FaCaravan />,
    title: "Comprehensive Packages",
    descri:
      "We offer a wide range of car washing services to cater to all your needs, including",
  },
  {
    key: 4,
    icon: <FaCarOn />,
    title: "Eco-Friendly Products",
    descri:
      "We are committed to sustainability and use eco-friendly cleaning products that are safe for the environment.",
  },
];
const mydata1 = [
  {
    key: 1,
    src: img5,
  },
];

function WhyChouseUsComponents() {
  return (
    <>
      <div className="pt-8">
  {/* Heading */}
  <div className="text-center font-bold text-4xl text-mywhite md:text-5xl lg:text-6xl">
    <h1>Why Choose Us</h1>
  </div>

  {/* Description text */}
  <div className="text-lg text-mywhite md:text-2xl py-8 md:pt-16 mx-6 sm:mx-10 md:mx-14 lg:mx-32 flex justify-center">
    <p>
      Choosing the right car wash service can make a significant difference in
      the care and maintenance of your vehicle. Here’s why we stand out as the
      best option for your car washing needs:
    </p>
  </div>

  {/* Main Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 zzzmd:mx-5 lg:mx-10 px-5  ">
    {/* Left Side - Images */}
    <div className="flex  justify-center lg:justify-start">
      {mydata1.map((item1, index) => (
        <div key={index} className="  w-auto">
          <img
            src={item1.src}
            alt=""
            className="object-cover   "
          />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mydata.map((item, key) => (
        <div
          key={key}
          className="rounded-md shadow-md text-black bg-white py-2 px-3"
        >
          <div className="flex items-center justify-center mb-4 h-6">
            {item.icon}
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
              {item.title}
            </h2>
            <p className="text-base md:text-lg text-black">{item.descri}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    </>
  );
}

export default WhyChouseUsComponents;
