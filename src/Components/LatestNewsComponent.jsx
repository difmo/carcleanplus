import React from "react";
import img from "../assets/latestnews/1.jpg";
import img1 from "../assets/latestnews/2.jpg";
const mydata = [
  {
    key: 1,
    src: img,
    title:"The Statstics Behind YourMechanic'sA/B Testing Platform",
    descri:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, animi? Illum deleniti ullam quia quisquam aut",
  },
  {
    key: 2,
    src: img1,
    title:"Optimization model for balancing Consumer Experience with Supply Utillzation in a Marketplace",
    descri:
      " Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, animi? Illum deleniti ullam quia quisquam aut",
  },
];
function LatestNewsComponent() {
  return (
    <>
      <div className="  bg-[#202020] ">
        <h1 className="text-center text-3xl font-bold text-mywhite py-4">
          Latest New & Artical
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center py-4">
          {mydata.map((item, key) => (
            <div key={key} className="w-full">
              <div className="flex flex-col md:flex-row  shadow-md  bg-black  text-gray-100">
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <img
                    src={item.src}
                    alt=""
                    className="object-cover object-center w-full h-full"
                    style={{ minHeight: "15rem", maxHeight: "25rem" }}
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col justify-center p-6 space-y-4 w-full md:w-1/2">
                  <div className="space-y-2">
                    <h2 className="text-xl  text-center md:text-left font-semibold tracking-wide text-myyellow">
                      {item.title}
                    </h2>
                    <p className="text-white ">{item.descri}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LatestNewsComponent;
