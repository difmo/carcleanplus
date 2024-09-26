import React from "react";
import Button from "./Button";
import img from "../assets/home.jpg";
function Viresonapp() {
  return (
    <>
      <div className="bg-blue-200 my-12 w-full  flex justify-between">
        <div className=" p-10 px-20">
          <div className="text-6xl   font-medium">
            Download the Latest Version of the App from
          </div>
          <div>
            <div>
              <Button />
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <img src={img} alt="" className="h-[600px]  rounded-3xl w-" />
        </div>
      </div>
    </>
  );
}

export default Viresonapp;
