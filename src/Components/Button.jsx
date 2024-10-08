import React from "react";
import img from "../assets/btn-app-store.webp";
import Img from "../assets/btn-play-store.webp";

const Button = () => {
  return (
    <>
      <div className="bg-[#ffd101] h-11 w-32 text-mywhite  rounded-lg text-center mx-4 px-3 py-2">
        <button>Discover More</button>
      </div>
    </>
    //   <div className="mt-16 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
    //   <div>
    //     <button type="button" className="inline-block">
    //       <img
    //         src={img}
    //         alt="Download on the App Store"
    //         className="h-16 md:h-20 w-auto"
    //       />
    //     </button>
    //   </div>
    //   <div>
    //     <button type="button" className="inline-block">
    //       <img
    //         src={Img}
    //         alt="Get it on Google Play"
    //         className="h-16 md:h-20 w-auto"
    //       />
    //     </button>
    //   </div>
    // </div>
  );
};

export default Button;
