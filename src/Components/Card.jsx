import React from "react";
import img5 from "../assets/home1.png";
import WhyChouseUsComponents from "./WhyChouseUsComponents";
import {
  FaCalculator,
  FaCalendarAlt,
  FaCarAlt,
  FaCarBattery,
  FaCompressArrowsAlt,
  FaIdCardAlt,
} from "react-icons/fa";
import CardSlider from "./CardSlider";
import { RiHomeGearFill } from "react-icons/ri";
const mydata = [
  {
    key: 1,
    icon: <RiHomeGearFill />,
    title: "Preventative Maintenance",
    descri:
      "Key benefits include reduced downtime, cost savings, improved safety, and optimized performance.",
  },
  {
    key: 2,
    icon: <FaCalendarAlt />,
    title: "Brake Repair ",
    descri:
      "Brake repair and services involve inspecting, maintaining, and replacing components of a vehicle's braking system. ",
  },
  {
    key: 3,
    icon: <FaCarAlt />,
    title: "Transmission Service & Repair",
    descri:
      "Vulputato sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 4,
    icon: <FaIdCardAlt />,
    title: "Engine Services ",
    descri:
      "Engine services involve the maintenance and repair of a vehicle's engine to ensure optimal performance and longevity",
  },
  {
    key: 5,
    icon: <FaCompressArrowsAlt />,
    title: "Tires & Wheels",
    descri:
      " Tires and wheels are vital components of any vehicle, significantly impacting safety, performance, and comfort",
  },
  {
    key: 6,
    icon: <FaCarAlt />,
    title: "Exhaust System",
    descri:
      "The exhaust system is essential for directing harmful gases away from the engine and reducing vehicle emissions..",
  },
  {
    key: 7,
    icon: <FaCarBattery />,
    title: "Body Service",
    descri:
      "Body service involves the maintenance and repair of a vehicle's exterior components to enhance appearance .",
  },
  {
    key: 8,
    icon: <FaCalculator />,
    title: "Diagnostic Car",
    descri:
      "Diagnostic car services involve identifying and troubleshooting issues within a vehicle using specialized tools and technology",
  },
];

function Card({ heading, description }) {
  return (
    <>
      <div className="">
        <div className="text-center font-bold text-black text-4xl md:text-5xl lg:text-6xl py-7">
          <h1>Our Services</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-4 md:mx-10 lg:mx-20">
          {mydata.map((item) => (
            <div
              key={item.key}
              className="rounded-md shadow-md bg-slate-100  sm:mx-6 md:mx-4 lg:mx-5 mt-5 w-full border-1 border-gray-100  "
            >
              <div className="flex items-center justify-center mt-6">
                <div className="object-cover object-center rounded-t-md">
                  {item.icon}
                </div>
              </div>
              <div className="flex flex-col p-3 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-semibold tracking-wide text-center">
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
        <div>
          <CardSlider />
        </div>
      </div>
    </>
  );
}
export default Card;
