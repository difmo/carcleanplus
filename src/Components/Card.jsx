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
      "Key benefits include reduced downtime, cost savings, improved safety, and optimized performance.",
  },
  {
    key: 2,
    icon: <FaCalendarAlt/>,
    title:'Brake Repair ',
    descri:
      "Brake repair and services involve inspecting, maintaining, and replacing components of a vehicle's braking system. ",
  },
  {
    key: 3,
    icon: <FaCarAlt/>,
    title:'Transmission Service & Repair',
    descri:
      "Vulputato sagittis purus hac ultrices. Nunc semper eleifend tristique venenatis",
  },
  {
    key: 4,
    icon: <FaIdCardAlt/>,
    title:'Engine Services ',
    descri:
    "Engine services involve the maintenance and repair of a vehicle's engine to ensure optimal performance and longevity",
  },
  {
    key: 5,
    icon: <FaCompressArrowsAlt/>,
    title:'Tires & Wheels',
    descri:
    " Tires and wheels are vital components of any vehicle, significantly impacting safety, performance, and comfort",
  },
  {
    key: 6,
    icon: <FaCarAlt />,
    title:'Exhaust System',
     descri:
    "The exhaust system is essential for directing harmful gases away from the engine and reducing vehicle emissions..",
  },
  {
    key: 7,
    icon: <FaCarBattery/>,
    title:'Body Service',
    descri:
      "Body service involves the maintenance and repair of a vehicle's exterior components to enhance appearance .",
  },
  {
    key: 8,
    icon: <FaCalculator/>,
    title:'Diagnostic Car',
    descri:
      "Diagnostic car services involve identifying and troubleshooting issues within a vehicle using specialized tools and technology",
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
                  <h2 className="text-xl font-semibold tracking-wide px-5 text-center">
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
        

        <div
          className="bg-no-repeat bg-cover bg-center   "
          style={{
            backgroundImage: "url('src/assets/cardslider/bgimg.jpg')",
          }}
        >
          <CardSlider />
        </div>
      </div>
    </>
  );
}

export default Card;
