import React from "react";
import img5 from "../assets/home1.png";


import WhyChouseUsComponents from "./WhyChouseUsComponents";

import { FaCalculator, FaCalendarAlt, FaCarAlt, FaCarBattery, FaCompressArrowsAlt, FaIdCardAlt } from "react-icons/fa";
import CardSlider from "./CardSlider";
import { RiHomeGearFill } from "react-icons/ri";
const mydata = [
  {
    key: 1,
    icon: <RiHomeGearFill/>,
    title:'Preventative Maintenance',
    descri:
      "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 2,
    icon: <FaCalendarAlt/>,
    title:'Preventative Maintenance',
    descri:
      "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 3,
    icon: <FaCarAlt/>,
    title:'Preventative Maintenance',
    descri:
      "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 4,
    icon: <FaIdCardAlt/>,
    title:'Preventative Maintenance',
    descri:
    "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 5,
    icon: <FaCompressArrowsAlt/>,
    title:'Preventative Maintenance',
    descri:
    "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 6,
    icon: <FaCarAlt />,
    title:'Preventative Maintenance',
     descri:
    "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 7,
    icon: <FaCarBattery/>,
    title:'Preventative Maintenance',
    descri:
      "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 8,
    icon: <FaCalculator/>,
    title:'Preventative Maintenance',
    descri:
      "Vulputate sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
];

function Card({ heading, description }) {
  return (
    <>
      <div className=" bg-[#202020]">
        <div className="text-center font-bold text-mywhite text-6xl py-7">
          <h1>Our Services</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  justify-items-center items-center md:mx-20  ">
          {mydata.map((item) => (
            <div
              key={item.key}
              className="rounded-md shadow-md text-black bg-white mx-5 mt-5"
            >
              <div className="flex items-center justify-center mt-6 object-cover object-center rounded-t-md">
                {item.icon}
              </div>
              <div className="flex flex-col p-6 space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-wide px-10">
                    {item.title}
                  </h2>
                  <p className="text-black text-center">{item.descri}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <WhyChouseUsComponents />
        </div>
        {/* <div
        className="absolute -bottom-0  left-0 w-full h-80 bg-yellow-400 transform origin-bottom"
        style={{ transform: "rotate(6deg)" }}
      ></div> */}

        <div
          className="bg-no-repeat bg-cover bg-center mx-10 md:mx-40  "
          style={{
            backgroundImage: "url('src/assets/car-wash.jpg')",
          }}
        >
          <CardSlider />
        </div>
      </div>
    </>
  );
}

export default Card;
