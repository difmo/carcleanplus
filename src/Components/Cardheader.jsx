import React from "react";
import img5 from "../assets/carCard.gif";
import img1 from "../assets/carcard1.gif";
import img2 from "../assets/carcard2.gif";
import img3 from "../assets/carcard3.gif";
// import img4 from "../assets/carcard4.gif";


const mydata = [
  {
    key: 1,
    src: img5,
    descri: "",
  },
  {
    key: 2,
    src: img1,
    descri: "",
  },
  {
    key: 3,
    src: img2,
    descri: "",
  },
  {
    key: 4,
    src: img3,
    descri: "",
  },
];

function HeaderCard({ heading, description }) {
  return (
    <>
      <div className="flex justify-center items-center md:-top-32 relative md:mx-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mydata.map((item, key) => {
            return (
              <div key={key} className="flex justify-center">
                <div className="rounded-md w-72 shadow-md bg-black text-gray-100">
                  <img
                    src={item.src}
                    alt=""
                    className="object-cover object-center w-full rounded-t-md h-72 bg-gray-500"
                  />
                  <div className="flex flex-col justify-center p-6 space-y-8">
                    <div className="space-y-2">
                      <h2 className="text-3xl text-center font-semibold tracking-wide">
                        Lorem
                      </h2>
                      <p className="text-gray-400">{item.descri}</p>
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
