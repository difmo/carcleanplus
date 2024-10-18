import React from "react";
import img5 from "../assets/headercard/Diagnostic.png";
import img1 from "../assets/headercard/engine.png";
import img2 from "../assets/headercard/Tires.png";
import img3 from "../assets/headercard/body.png";
// import img4 from "../assets/carcard4.gif";

const mydata = [
  {
    key: 1,
    src: img5,
    descri: "Diagnostic Car",
  },
  {
    key: 2,
    src: img1,
    descri: "Engine Repair",
  },
  {
    key: 3,
    src: img2,
    descri: "Tires Services",
  },
  {
    key: 4,
    src: img3,
    descri: "Body Services",
  },
];

function HeaderCard({ heading, description }) {
  return (
    <>
      <div className="relative flex items-center justify-center sm:-top-6 md:top-28 lg:-top-16 md:mx-5">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {mydata.map((item, key) => {
            return (
              <div key={key} className="flex justify-center">
                <div className="rounded-2xl w-full md:max-w-xs shadow-md bg-[#002f49] text-gray-100 border-4 border-indigo-50">
                  <img
                    src={item.src}
                    alt=""
                    className="object-cover object-center w-full bg-[#002f49] rounded-xl h-48 sm:h-56"
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
    </>
  );
}

export default HeaderCard;
