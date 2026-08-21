import React from "react";
import img5 from "../assets/headercard/Diagnostic.png";
import img1 from "../assets/headercard/engine.png";
import img2 from "../assets/headercard/Tires.png";
import img3 from "../assets/headercard/body.png";
import img4 from "../assets/about/car-image.png";
import Img1 from "../assets/Svg/Vector.svg";
const mydata = [
  {
    key: 1,
    src: img5,
    descri: "Vacuuming",
  },
  {
    key: 2,
    src: img1,
    descri: "Shampooing",
  },
  {
    key: 3,
    src: img2,
    descri: " Polishing ",
  },
  {
    key: 4,
    src: img3,
    descri: "Stain Removal",
  },
];

function HeaderCard({ heading, description }) {
  return (
    <>
      <div
        className="bg-no-repeat bg-cover bg-center md:h-[500px] "
        style={{
          backgroundImage: `url(${img4})`,
        }}
      >
        <div className="bg-black bg-opacity-80">
          <img src={Img1} alt="" />
          <div className="relative flex items-center justify-center sm:-top-6 -top-16 md:px-5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2  lg:grid-cols-4 ">
              {mydata.map((item, key) => {
                return (
                  <div key={key} className="flex justify-center">
                    <div className="relative bottom-[12rem] md:bottom-[22rem] lg:bottom-[36rem] rounded-2xl w-full shadow-md bg-[#002f49] text-gray-100 border-4 border-indigo-50 ">
                      <img
                        src={item.src}
                        alt=""
                        className="object-cover object-center w-full bg-[#002f49] rounded-xl h-48  md:h "
                      />
                      <div className="flex flex-col justify-center p-4 sm:p-6 space-y-4">
                        <div className="space-y-2">
                          <p className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-center">
                            {item.descri}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderCard;
