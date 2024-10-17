import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import home1 from "../assets/cardslider/img1.jpg";
import car from "../assets/cardslider/img1.jpg";
import car3 from "../assets/man.jpg";

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
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 2000,
  };

  return (
    <div className="w-1/2 mr-1 rounded-3xl mx-12 py-12  justify-center-center">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] flex-shrink-0 relative"
          >
            <img
              src={image.image}
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 right-0 top-5 sm:top-10">
              <h1 className="text-xl font-bold text-center text-mywhite md:text-2xl lg:text-4xl lg:px-5">
                {image.title}
              </h1>
              <p className="p-4 text-xl font-medium text-center text-mywhite">
                {image.description}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;
