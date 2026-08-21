import React from 'react';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaMapMarkerAlt, FaUsers, FaTrophy, FaClock, FaHeart, FaCar } from 'react-icons/fa';

import bgImage from '../assets/home1.png';
import img1 from '../assets/wash car.png';
import img2 from '../assets/seat2.png';
import img3 from '../assets/Complete Detailing.png';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Rahul Sharma',
      location: 'Delhi',
      rating: 5,
      text: (
        <>
          "Amazing service! My car looks brand new. The team is very professional."
        </>
      ),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      bottomImage: img1
    },
    {
      name: 'Priya Mehta',
      location: 'Gurugram',
      rating: 5,
      text: (
        <>
          "Very competitive and on-time service. Highly recommended!"
        </>
      ),
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      bottomImage: img2
    },
    {
      name: 'Arjun Verma',
      location: 'Noida',
      rating: 5,
      text: (
        <>
          "Best car wash experience so far. Loved the interior cleaning."
        </>
      ),
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
      bottomImage: img3
    }
  ];

  return (
    <section className="pt-6 pb-16 bg-transparent relative overflow-hidden z-10">

      {/* Subtle top-right car background */}
      <div
        className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-5 md:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          maskImage: 'linear-gradient(to right, transparent, black)',
          WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black)'
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Area */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-gray-900 mb-2 tracking-tight">
            Hear From Our <span className="text-primary">Happy Customers</span>
          </h2>

          <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto font-medium leading-relaxed mb-4">
            Don't just take our word for it. Discover why car owners across Lucknow trust us for their <span className="text-primary font-bold">premium detailing</span> needs.
          </p>

          {/* Subtle Car Separator */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-6 bg-primary-light/30"></div>
            <FaCar className="text-primary text-base" />
            <div className="h-[1px] w-6 bg-primary-light/30"></div>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto mb-10">
          {reviews.map((review, index) => (
            <div key={index} className="flex flex-col bg-white border border-gray-200 rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl hover:border-primary-light/30 transition-all duration-300 h-full group">

              {/* Content Top */}
              <div className="p-5 flex flex-col flex-grow relative">

                {/* Top Row: Quote Icon & Profile Image */}
                <div className="flex justify-between items-start mb-4">
                  <FaQuoteLeft className="text-3xl text-primary/20 group-hover:text-primary/40 transition-colors" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-full p-0.5 border-2 border-primary-light/30 group-hover:border-primary-light transition-colors">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    {/* Verified Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <FaCheckCircle className="text-primary text-sm" />
                    </div>
                  </div>
                </div>

                {/* Name & Location */}
                <div className="mb-2">
                  <h4 className="font-extrabold text-gray-900 text-base">{review.name}</h4>
                  <div className="flex items-center text-gray-500 text-[10px] md:text-xs font-medium">
                    <FaMapMarkerAlt className="text-primary mr-1" />
                    {review.location}
                  </div>
                </div>

                {/* Stars */}
                <div className="flex text-yellow-400 mb-3 gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} size={12} />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-xs md:text-sm italic leading-relaxed z-10 relative">
                  "{review.text}"
                </p>
              </div>

              {/* Bottom Image Area */}
              <div className="h-24 md:h-32 w-full relative shrink-0">
                {/* Gradient to blend dark into the image */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                <img
                  src={review.bottomImage}
                  alt="Car Cleaning"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Trust Banner */}
        <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-md p-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">

            <div className="flex items-center gap-3 px-2 md:px-4 pt-2 md:pt-0 first:pt-0">
              <div className="p-2 bg-primary-light/10 text-primary rounded-full shrink-0">
                <FaCheckCircle className="text-sm md:text-base" />
              </div>
              <div>
                <h5 className="font-extrabold text-gray-900 text-xs md:text-sm">Trusted by 500+</h5>
                <p className="text-gray-500 text-[9px] md:text-[10px]">Satisfied Customers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 md:px-4 pt-2 md:pt-0">
              <div className="p-2 bg-primary-light/10 text-primary rounded-full shrink-0">
                <FaTrophy className="text-sm md:text-base" />
              </div>
              <div>
                <h5 className="font-extrabold text-gray-900 text-xs md:text-sm">Premium Quality</h5>
                <p className="text-gray-500 text-[9px] md:text-[10px]">Cleaning Services</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 md:px-4 pt-2 md:pt-0">
              <div className="p-2 bg-primary-light/10 text-primary rounded-full shrink-0">
                <FaClock className="text-sm md:text-base" />
              </div>
              <div>
                <h5 className="font-extrabold text-gray-900 text-xs md:text-sm">On-Time Service</h5>
                <p className="text-gray-500 text-[9px] md:text-[10px]">Every Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 md:px-4 pt-2 md:pt-0">
              <div className="p-2 bg-primary-light/10 text-primary rounded-full shrink-0">
                <FaHeart className="text-sm md:text-base" />
              </div>
              <div>
                <h5 className="font-extrabold text-gray-900 text-xs md:text-sm">100% Satisfaction</h5>
                <p className="text-gray-500 text-[9px] md:text-[10px]">Guaranteed</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
