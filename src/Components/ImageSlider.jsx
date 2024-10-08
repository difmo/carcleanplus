import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import header2 from "../assets/car-wash.jpg";
import header3 from "../assets/carslider.jpg";
import header from "../assets/man.jpg";

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
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full max-w-screen relative">
            <div className="overflow-hidden relative">
              <img
                src={image.image}
                alt={`Slide ${index + 1}`}
                className="w-full object-cover h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
              />
              <div className="relative bottom-64 md:bottom-96 left-0 right-0 flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold lg:px-40 text-mywhite p-4">
                  {image.title}
                </h1>
                <p className="font-medium sm:text-2xl text-white p-4">
                  {image.description}
                </p>
                <button className="rounded-lg bg-myyellow text-white py-2 px-2 flex text-center md:text-xl">
                  {image.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
  
  );
};

export default ImageSlider;
