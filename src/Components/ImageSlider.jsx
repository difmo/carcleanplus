import React from "react";
import land from "../assets/landing.jpg";

const ImageSlider = () => {
  return (
    <div
      className="h-[500px] md:h-[850px]  flex flex-col md:flex-row bg-cover pt-32 relative "
      style={{
        backgroundImage: `url(${land})`,
        // height: "500px",
      }}
    >
      {/* Booking Form */}
      <div className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] absolute z-20 max-w-md bg-white p-6 rounded-lg shadow-lg px-4 top-[100%] sm:top-[55%] md:top-[50%] lg:top-32 right-1/2 translate-x-1/2 md:right-3 md:translate-x-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center md:text-left">
          Experience The Best Car Services
        </h2>
        <p className="text-gray-600 mb-4 text-center md:text-left">
          Get instant quotes for your car service
        </p>

        {/* Location Dropdown */}
        <select className="w-full p-3 border rounded mb-4">
          <option>Gurgaon</option>
          <option>Delhi</option>
          <option>Noida</option>
          <option>Faridabad</option>
          <option>Ghaziabad</option>
          <option>Jaipur</option>
          <option>Chandigarh</option>
          <option>Lucknow</option>
          <option>Bangalore</option>
          <option>Mumbai</option>
        </select>

        {/* Car Selection Dropdown */}
        <select className="w-full p-3 border rounded mb-4">
          <option>Select Your Car</option>
          <option>Toyota Fortuner</option>
          <option>Maruti Suzuki Swift</option>
          <option>Hyundai Creta</option>
          <option>Honda City</option>
          <option>Mahindra Thar</option>
          <option>Ford Endeavour</option>
          <option>Volkswagen Polo</option>
          <option>Kia Seltos</option>
          <option>Tata Harrier</option>
          <option>Mercedes-Benz GLC</option>
        </select>

        {/* Mobile Number Input */}
        <input
          type="text"
          placeholder="Enter Mobile Number"
          className="w-full p-3 border rounded mb-4"
        />

        {/* Button */}
        <button className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 transition duration-300">
          Check Prices for Free
        </button>

        {/* Reviews & Customers */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-gray-700 text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <span className="text-green-500 font-bold">4.0/5</span>
            <p className="text-sm">Based on 150+ Reviews</p>
          </div>
          <div>
            <span className="font-bold">200+</span>
            <p className="text-sm">Happy Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;

// import React from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import header2 from "../assets/imageslider/images.png";
// import header3 from "../assets/imageslider/carwash.png";
// import header from "../assets/imageslider/slider.png";
// const ImageSlider = () => {
//   const images = [
//     {
//       title: "Eco-Friendly Car Detailing Solutions",
//       description:
//         "Eco-friendly detailing at INFINITY WASH for a spotless, safe clean.",
//       buttonText: "Discover More",
//       image: header2,
//     },
//     {
//       title: "Comprehensive Car Cleaning Services",
//       description:
//         "Comprehensive car cleaning with minimal water for outstanding results.",
//       buttonText: "Discover More",
//       image: header3,
//     },
//     {
//       title: "Professional Car Cleaning with Water Conservation",
//       description:
//         "Innovative car cleaning using 20 litres, conserving water responsibly",
//       buttonText: "Discover More",
//       image: header,
//     },
//   ];
//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     arrows: false,
//     autoplay: true,
//     autoplaySpeed: 2000,
//   };
//   return (
//     <div className=" w-full  ">
//       <Slider {...settings}>
//         {images.map((image, index) => (
//           <div
//             key={index}
//             className="w-full relative  bg-primary h-[500px] lg:h-[600px]  overflow-hidden  "
//           >
//             <div className="w-auto">
//               <img
//                 src={image.image}
//                 alt={`Slide ${index + 1}`}
//                 className="w-full bg-no-repeat object-cover bg-cover"
//               />
//             </div>

//             <div className=" flex flex-col items-center  absolute top-0  bottom-32 left-0 right-0 justify-center text-center">
//               <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold lg:px-40 text-mywhite p-2">
//                 {image.title}
//               </h1>
//               <p className="font-medium sm:text-2xl text-mywhite p-4">
//                 {image.description}
//               </p>
//               <button className="rounded-full bg-black  text-white py-3 md:py-4 px-5 md:px-12 flex text-center  md:text-xl border-2 border-indigo-50">
//                 {image.buttonText}
//               </button>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default ImageSlider;
