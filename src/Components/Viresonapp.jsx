import React from "react";
import Button from "./Button";
import img from "../assets/Phone.png";

function Viresonapp() {
  return (
    <div className="bg-white py-20">
      <div className=" bg-slate-800 my-12  flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="text-2xl md:text-6xl w-full md:w-1/2 font-medium px-6 md:px-28 pt-12 text-white text-center md:text-left">
          Download the Latest Version of the App from
        </div>

        <div className="w-full md:w-auto flex justify-center md:justify-start my-4 md:my-0">
          <Button />
        </div>

        <div className="w-full flex justify-center items-center mt-6 md:mt-0">
          <img src={img} alt="" className="h-auto object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Viresonapp;
