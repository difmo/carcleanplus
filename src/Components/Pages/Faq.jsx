import React from "react";
import FormContact from "../FormContact";
import Viresonapp from "../Viresonapp";

function Faq() {
  return (
    <>
      <div className="object-cover mx-4 md:mx-48 my-8 md:my-16 h-36 md:h-72 bg-[rgb(0,69,120)] rounded-3xl">
        <div className="font-medium text-4xl md:text-7xl text-cyan-50 text-center py-4 md:py-20 px-6 md:px-64">
          Frequently Asked Questions
        </div>

      </div>

      <div className="flex flex-col md:flex-row justify-between pt-4 md:pt-10 px-4 md:px-20">

        <div className="w-full md:w-1/2 text-3xl md:pr-4 text-center md:text-left">
          Can't Find an Answer? Contact our support team
          <FormContact />

        </div>
        
        <div className="w-full md:w-1/2 font-serif pt-4 md:pt-0">
          <div className="px-4 md:px-10">
            <div className="py-2 font-serif font-extrabold">
              Lorem ipsum dolor sit amet
            </div>
            <div className="text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu.
            </div>
          </div>
          <div className="px-4 md:px-10 pt-4">
            <div className=" py-2 font-serif font-extrabold ">
              Far far away, behind the word mountains
            </div>
            <div className="text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu.
            </div>
          </div>
          <div className="px-4 md:px-10 pt-4">
            <div className="py-2 font-serif font-extrabold ">
              Far far away, behind the word mountains
            </div>
            <div className="text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa. Cum sociis natoque
              penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
              sem. Nulla consequat massa quis enim. Donec pede justo, fringilla
              vel, aliquet nec, vulputate eget, arcu.
            </div>
          </div>
        </div>
      </div>
      <Viresonapp />
    </>
  );
}

export default Faq;
