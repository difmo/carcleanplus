import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import header2 from "../assets/imageslider/images.png";
import header3 from "../assets/imageslider/carwash.png";
import header from "../assets/imageslider/slider.png";

const ImageSlider = () => {
  const images = [
    {
      title: "The best auto service repairs",
      description: "I want to join the Codeservir",
      buttonText: "Discover More",
      image: header2,
    },
    {
      title: "The best auto service repairs",
      description: "I want to join the Codeservir",
      buttonText: "Discover More",
      image: header3,
    },
    {
      title: "The best auto service repairs",
      description: "I want to join the Codeservir",
      buttonText: "Discover More",
      image: header,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Disable previous and next buttons
    autoplay: true, // Enable auto-sliding
    autoplaySpeed: 2000,
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div
          key={index}
          className="w-full relative bg-primary h-[300px]  md:h-[400px] lg:h-[510px] overflow-hidden  "
        >
          <img
            src={image.image}
            alt={`Slide ${index + 1}`}
            className="w-full bg-no-repeat object-cover "
          />
          <div className="relative bottom-32 sm:-bottom-16   md:bottom-[490px] left-0 right-0 flex flex-col items-center       justify-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold lg:px-40 text-mywhite p-4">
              {image.title}
            </h1>
            <p className="font-medium sm:text-2xl text-mywhite p-4">
              {image.description}
            </p>
            <button className="rounded-full bg-black  text-white py-3 md:py-4 px-5 md:px-12 flex text-center  md:text-xl border-2 border-indigo-50">
              {image.buttonText}
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
