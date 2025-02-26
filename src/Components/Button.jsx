import React from "react";
const Button = () => {
  return (
    <>
      <div className="bg-red-500  text-mywhite  rounded-lg text-center  px-9  font-bold border-2 border-indigo-50 hover:bg-red-700 hover:text-black">
        <a href="https://play.google.com/store/apps/details?id=com.codeservir.carcleanplus.new">
          {" "}
          <button className="w-28 h-10">Discover More</button>
        </a>
      </div>
    </>
  );
};
export default Button;
