import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import home1 from "../assets/cardslider/img.png";
import car from "../assets/cardslider/img1.png";
import car3 from "../assets/cardslider/img2.png";

const images = [
  {
    title: "Ultimate Car Care Experience",
    description: "Experience ultimate car care at INFINITY WASH, combining technology and eco-friendly practices for exceptional results that restore your vehicle’s beauty.",
    buttonText: "Discover More",
    image: car3,
  },
  {
    title: "Affordable Car Cleaning with a Green Touch",
    description: "Enjoy affordable, eco-friendly car cleaning at INFINITY WASH, where quality meets sustainability for a sparkling, responsible finish.",
    buttonText: "Discover More",
    image: car,
  },
  {
    title: "Sustainable Car Care for Every Vehicle",
    description: "Choose INFINITY WASH for eco-friendly car care using minimal water and safe products to keep your vehicle spotless and valued.",
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
