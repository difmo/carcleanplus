import React from "react";
// import  img from '../assets/logo.png';
import img3 from "../assets/Logo/jeep-logo.png";
import img4 from "../assets/Logo/logo2.png";
import img5 from "../assets/Logo/logo3.png";
import img1 from "../assets/Logo/logo1.png";
import img2 from "../assets/Logo/gmc-logo.png";

function LogoComponent() {
  return (
    <>
      <div className="flex flex-wrap  bg-[#202020] justify-center">
        <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
          <img className="object-cover w-full h-full" src={img5} alt="" />
        </div>
        <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
          <img className="object-cover w-full h-full" src={img2} alt="" />
        </div>
        <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
          <img className="object-cover w-full h-full" src={img1} alt="" />
        </div>
        <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
          <img className="object-cover w-full h-full" src={img4} alt="" />
        </div>
        <div className="p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5">
          <img className="object-cover w-full h-full" src={img3} alt="" />
        </div>
      </div>
    </>
  );
}

export default LogoComponent;
