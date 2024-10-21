import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import home1 from "../assets/cardslider/img.png";
import car from "../assets/cardslider/img1.png";
import car3 from "../assets/cardslider/img2.png";

const images = [
  {
    title: "The best auto service repairs",
    description: "I want to join the Codeservir",
    buttonText: "Discover More",
    image: car3,
  },
  {
    title: "The best auto service repairs",
    description: "I want to join the Codeservir",
    buttonText: "Discover More",
    image: car,
  },
  {
    title: "The best auto service repairs",
    description: "I want to join the Codeservir",
    buttonText: "Discover More",
    image: home1,
  },
];
const CardSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 2000,
  };

  return (
    <>
    <div className="w-full">
  <Slider {...settings}>
    {images.map((image, index) => (
      <div key={index} className="w-full overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-1/2">
            <img
              src={image.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 px-4 md:px-6 lg:px-8 self-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-mywhite py-4">
              {image.title}
            </h1>
            <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium text-mywhite py-4">
              {image.description}
            </p>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>
    </>
  );
};

export default CardSlider;
