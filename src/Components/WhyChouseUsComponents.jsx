import React from "react";

import { FaCalendarCheck, FaCarAlt, FaCaravan } from "react-icons/fa";
import img5 from "../assets/home1.png";
import { Fa42Group, FaCarOn } from "react-icons/fa6";
const mydata = [
  {
    key: 1,
    icon: <FaCarAlt />,
    descri:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit Distinctio ",
  },
  {
    key: 2,
    icon: <FaCalendarCheck/>,
    descri:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit Distinctio ",
  },
  {
    key: 3,
    icon: <FaCaravan/>,
    descri:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit Distinctio ",
  },
  {
    key: 4,
    icon: <FaCarOn/>,
    descri:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit Distinctio ",
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
  <div className="text-center font-bold text-4xl text-mywhite md:text-5xl lg:text-6xl">
    <h1>Why Choose Us</h1>
  </div>

  {/* Description text */}
  <div className="text-lg text-mywhite md:text-2xl py-8 md:pt-16 mx-40 md:mx-14 lg:mx-32 flex justify-center md:justify-center">
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, aliquid.
    </p>
  </div>

  {/* Main Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 md:mx-20 my-2 mx-5">
    
    {/* Left Side - Images */}
    <div className="flex flex-wrap justify-center pb-4 lg:justify-start">
      {mydata1.map((item1, index) => (
        <div key={index} className=" ">
          <img
            src={item1.src}
            alt=""
            className="object-cover object-center rounded-md"
          />
        </div>
      ))}
    </div>

    {/* Right Side - Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mydata.map((item, key) => (
        <div key={key} className="rounded-md shadow-sm text-black bg-white p-6">
          <div className="flex items-center justify-center mb-4">
            {item.icon}
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide">
              Lorem
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
