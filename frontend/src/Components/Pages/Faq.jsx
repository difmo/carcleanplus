import React from "react";
import FormContact from "../FormContact";
import Viresonapp from "../Viresonapp";

function Faq() {
  return (
    <><div className="mt-24">
      <div
        id="faq"
        className="selection object-cover mx-4 md:mx-48 my-8 md:my-16 h-36 md:h-72 bg-[rgb(0,69,120)] rounded-3xl"
      >
        <div className="font-bold text-3xl md:text-6xl text-cyan-50 text-center py-8 md:py-24 px-6 md:px lin">
          Frequently Asked Questions
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-around pt-4 md:pt-10 px-4 md:px-20">
        {/* <div className="w-full  h-full">
          <h3 className="text-3xl py-4">
            Can't Find an Answer? Contact our support team
          </h3>
          <FormContact />
        </div> */}

        <div className="w-full font-serif py-4 ">
          <div className="px-4 md:px-10">
            <div className="py-2 font-serif font-extrabold">
              What is Car Detailing ?
            </div>
            <div className=" md:text-base">
              Car Detailing is particularly related to cleaning and preserving
              the original appearance of a car. It is much more than a car wash,
              it is more elaborate and labour-intensive in nature. Car detailing
              restores the shine of a vehicle and adds a layer of protection to
              its paint body.
            </div>
          </div>
          <div className="px-4 md:px-10 pt-4">
            <div className=" py-2 font-serif font-extrabold ">
              Why should I use The Detailing Mafia Services?
            </div>
            <div className="md:text-base">
              The Detailing Mafia offers the best-in-class Car Cleaning and Car
              Detailing services. We have mastered the art of Car Detailing in
              every field. Give your car the best treatment with the Mafia’s car
              cleaning and Detailing service.
            </div>
          </div>
          <div className="px-4 md:px-10 pt-4">
            <div className="py-2 font-serif font-extrabold ">
              What are your hours?
            </div>
            <div className=" md:text-base">
              Generally we are open on all days, from 10AM TO 8PM. On some
              occasions hours may differ.
            </div>
          </div>
          <div className="px-4 md:px-10 pt-4">
            <div className="py-2 font-serif font-extrabold ">
              What methods of payment do you accept?
            </div>
            <div className=" md:text-base">
              We accept all kinds of payment methods including, Cash in Hand,
              Google Pay, paytm, Phonepay UPI, NEFT and payment through our
              Value Cards.
            </div>
          </div>
        </div>
      </div>
      {/* <Viresonapp /> */}
      </div>
    </>
  );
}

export default Faq;
