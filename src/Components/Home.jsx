import React from "react";
import Button from "./Button";
import img from "../assets/Phone.png";
import img1 from "../assets/home1.png";
import img2 from "../assets/home2.png";
import Viresonapp from "./Viresonapp";
import Card from "./Card";
import About from "./About";
import ImageSlide from "./ImageSlider.jsx";
import HowCanhelpComponent from "./HowCanhelpComponent.jsx";
import LatestNewsComponent from "./LatestNewsComponent.jsx";
import LogoComponent from "./LogoComponent.jsx";
import ContactComponent from "./ContactComponent.jsx";

// primaryColor: #092b3d
// secondryColor : #ffd101

function Home() {
  return (
    <>
      <ImageSlide />

      <About />
      <Card />
      <HowCanhelpComponent />
      <LatestNewsComponent />

      <LogoComponent />
      <ContactComponent />

      {/* <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between my-6">
          <div className="w-full">
            <div className="md:text-6xl text-3xl text-zinc-800 font-medium md:font-serif text-center  md:text-left my-12 px-4 md:pl-24 md:pr-36">
              Congratulate Those Who Do Positive Deeds
            </div>
            <div className="px-4 md:pl-32 md:pr-26 text-lg md:text-xl leading-8 font-serif text-center md:text-left">
              Honoring those who make a difference, one good deed at a time.
              Join us in recognizing the individuals and groups who spread
              positivity and kindness in our communities.
              <div className="mt-6">
                <Button />
              </div>
            </div>
          </div> */}

      {/* Image Section */}
      {/* <div className="w-full  pt-8 md:pt-16"> */}
      {/* <div className="flex justify-center">
              <img
                className="  object-cover"
                src={img}
                alt="Profile"
              />
            </div> */}
      {/* </div> */}
      {/* </div> */}

      {/* Mission Statement and Stats Section */}
      {/* <div className="flex flex-col md:flex-row w-full pt-4">
          <div className="w-full md:w-1/2 px-4">
            <div className="text-3xl md:text-6xl font-serif text-center md:text-left">
              Our Mission is to Inspire Kindness to Cultivate Stronger
              Communities
            </div>
            <div className="pt-12 flex flex-col md:flex-row gap-12 text-2xl justify-center items-center text-center">
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600">|</span> 50+
                </div>
                <div className="p-2">Acts of Kindness</div>
              </div>
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600">|</span> 20+
                </div>
                <div className="p-2">Opportunities to Give</div>
              </div>
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600">|</span> 100+
                </div>
                <div className="p-2">Members</div>
              </div>
            </div> */}

      {/* Image 1 */}
      {/* <div className="pt-12">
              <img
                className="h-[300px] md:h-[500px] w-full object-cover rounded-[30px] p-4"
                src={img1}
                alt="Mission Image"
              />
            </div>
          </div> */}

      {/* Text and Image Section */}
      {/* <div className="w-full md:w-1/2 px-4 py-12">
            <div className="text-xl md:text-2xl leading-9 font-serif text-center md:text-left">
              At our core, we believe in the transformative power of kindness.
              Our mission is simple yet profound: to ignite a ripple effect of
              compassion that resonates throughout communities.
            </div>
            <div className="pt-12">
              <img
                className="rounded-[30px] h-[300px] md:h-[500px] w-full object-cover"
                src={img2}
                alt="Kindness Image"
              />
            </div>
          </div>
        </div> */}

      {/* <Card
          // heading={
          //   " Explore How to Make a Difference, Utilize Diverse Features for Impact"
          // }
          // description={
          //   "  Utilize the the various capabilities to maximize your influence as you discover new ways to make a difference."
          // }
        /> */}
      {/* <Viresonapp /> */}
      {/* </div> */}
    </>
  );
}

export default Home;
