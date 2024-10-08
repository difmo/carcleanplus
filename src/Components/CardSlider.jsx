import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import home1 from "../assets/about.png";
import car from "../assets/car1.jpg";
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
    <div className="w-1/2  ">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex-shrink-0 relative"
          >
            <img
              src={image.image}
              alt={`Slide ${index + 1}`}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-5 sm:top-10 left-0 right-0 bottom-0">
              <h1 className="text-xl md:text-2xl lg:text-4xl font-bold lg:px-5 text-center text-black">
                {image.title}
              </h1>
              <p className="font-medium text-xl text-black text-center p-4">
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

// import React, { useEffect, useState } from "react";
// // import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import header2 from "../assets/car4.jpeg";
// import car3 from "../assets/car3.webp";
// import home1 from "../assets/man.jpg";

// const CardSlider = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

// const images = [
//   {
//     title: "The best auto service repairs",
//     description: "I want to join the Codeservir",
//     buttonText: "Discover More",
//     image: header2,
//   },
//   {
//     title: "The best auto service repairs",
//     description: "I want to join the Codeservir",
//     buttonText: "Discover More",
//     image: car3,
//   },
//   {
//     title: "The best auto service repairs",
//     description: "I want to join the Codeservir",
//     buttonText: "Discover More",
//     image: home1,
//   },

// ];

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   useEffect(() => {
//     const interval= {
//       dots: true,
//       infinite: true,
//       speed: 500,
//       slidesToShow: 1,
//       slidesToScroll: 1,
//       autoplay: true,
//       autoplaySpeed: 2000
//     }; // Automatically slide every 2 seconds
//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, []);

//   return (
// <div className="flex py-4 mx-4 relative ">
//   {/* Card Slider */}
//   <div className="relative overflow-hidden w-1/2">
//     <div
//       className="flex transition-transform duration-1000 ease-in-out"
//       style={{
//         transform: `translateX(-${currentIndex * 100}%)`, // Slide right to left
//       }}
//     >
// {images.map((image, index) => (
//   <div
//     key={index}
//     className="min-w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex-shrink-0 relative"
//   >
//     <img
//       src={image.image}
//       alt={`Slide ${index + 1}`}
//       className="object-cover w-full h-full"
//     />
//     <div className="absolute top-5 sm:top-10 left-0 right-0 bottom-0">
//       <h1 className="text-xl md:text-2xl lg:text-4xl font-bold lg:px-5 text-center text-black">
//         {image.title}
//       </h1>
//       <p className="font-medium text-xl text-black text-center p-4">
//         {image.description}
//       </p>
//     </div>
//   </div>
// ))}
//     </div>

//         {/* Navigation Buttons */}
//         <button
//           onClick={prevSlide}
//           className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 focus:outline-none"
//         >
//           &lt;
//         </button>
//         <button
//           onClick={nextSlide}
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10 focus:outline-none"
//         >
//           &gt;
//         </button>
//         <div className="flex justify-center mt-4">
//         {images.map((_, index) => (
//           <div
//             key={index}
//             className={`h-2 w-2 mx-1 rounded-full cursor-pointer ${
//               index === currentIndex ? "bg-black" : "bg-gray-300"
//             }`}
//             onClick={() => setCurrentIndex(index)}
//           />
//         ))}
//       </div>
//       </div>

//       {/* Dots for Navigation */}

//     </div>
//   );
// };

// export default CardSlider;
