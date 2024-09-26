import React from "react";
import Button from "./Button";
import img from "../assets/home.jpg";
import img1 from "../assets/home1.png";
import img2 from "../assets/home2.png";
import img3 from "../assets/home3.jpg";
import img4 from "../assets/home4.jpg";
import img5 from "../assets/home5.jpg";
import Viresonapp from "./Viresonapp";

function Home() {
  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col md:flex-row justify-between my-6">
          <div className="w-full md:w-1/2 ">
            <div className="text-6xl text-zinc-800 font-serif  text-center my-12 pl-24 pr-36">
              Congratulate Those Who Do Positive Deeds
            </div>
            <div className=" pl-32 pr-26 text-xl leading-8  font-serif  ">
              Honoring those who make a difference, one good deed at a time.
              Join us in recognizing the individuals and groups who spread
              positivity and kindness in our communities.
              <div className="flex justify-around pt-4">
                <div className="flex-shrink-0">
                  <Button />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 pt-16">
            <div className="flex justify-center">
              <img
                className="w-[400px]  h-[580px]  rounded-[30px]"
                src={img}
                alt="Profile"
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-col md:flex-row w-full justify-between pt-4 ">
          <div className=" w-1/2">
            <div className=" flex  text-7xl ml-24 font-serif ">
              Our Mission is to Inspire Kindness to Cultivate Stronger
              Communities
            </div>
            <div className=" pt-12 flex gap-16 text-2xl ml-24 text ">
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600 ">|</span> 50+
                </div>
                <div className="p-2">Acts of Kindness</div>
              </div>
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600 ">|</span>20+
                </div>

                <div className="p-2">Opportunities to Give</div>
              </div>
              <div>
                <div className="font-bold text-4xl">
                  <span className="text-red-600 ">|</span>100+
                </div>
                <div className="p-2">Members</div>
              </div>
            </div>
            <div className="over">
              <div>
                <img
                  className="h-screen w-screen ml-14 p-8 rounded-[70px]"
                  src={img1}
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className=" w-1/2 px-24 py-12">
            <div className="  text-xl leading-9  font-serif  ">
              At our core, we believe in the transformative power of kindness.
              Our mission is simple yet profound: to ignite a ripple effect of
              compassion that resonates throughout communities.
            </div>
            <div className="pt-12">
              <img className=" rounded-[60px] h-screen" src={img2} alt="" />
            </div>
          </div>
        </div>
        <div className="px-20">
          <div className="text-7xl ml-24 font-serif py-4 pl-10">
            Explore How to Make a Difference, Utilize Diverse Features for
            Impact
          </div>
          <div className="  text-xl ml-24 leading-9  font-serif  ">
            Utilize the the various capabilities to maximize your influence as
            you discover new ways to make a difference.
          </div>
          <div className=" flex gap-12 justify-center mt-4">
            <div className=" w-[15rem] relative group">
              <img className=" object-cover rounded-lg " src={img} alt="" />
              <div className="absolute  bottom-0 w-full m-1 group-hover:flex justify-center h-auto hidden  transition-all duration-500 ">
                 dolor sit amet consectetur adipisicing elit. Ad vero
                voluptatem dignissimos quaerat porro rem, placeat rerum quod
                aliquid aperiam id quidem laborum. Mollitia iure nostrum quaerat
                quos dolores excepturi temporibus atque earum autem quis aperiam
                veniam exercitationem doloremque velit quod facilis sunt error
                
              </div>
            </div>
            <div className=" w-[15rem] relative group">
              <img className=" object-cover rounded-lg " src={img} alt="" />
              <div className="absolute  bottom-0 w-full m-1 group-hover:flex justify-center h-auto hidden  transition-all duration-500 ">
                dolor sit amet consectetur adipisicing elit. Ad vero
                voluptatem dignissimos quaerat porro rem, placeat rerum quod
                aliquid aperiam id quidem laborum. Mollitia iure nostrum quaerat
                quos dolores excepturi temporibus atque earum autem quis aperiam

              </div>
            </div>
            <div className=" w-[15rem] relative group">
              <img className=" object-cover rounded-lg " src={img} alt="" />
              <div className="absolute  bottom-0 w-full m-1 group-hover:flex justify-center h-auto hidden  transition-all duration-500 ">
               dolor sit amet consectetur adipisicing elit. Ad vero
                voluptatem dignissimos quaerat porro rem, placeat rerum quod
                aliquid aperiam id quidem laborum. Mollitia iure nostrum quaerat
                quos dolores excepturi temporibus atque earum autem quis aperiam
                veniam exercitationem doloremque velit quod facilis sunt error
          
              </div>
            </div>
          </div>
        </div>
      </div>
      <Viresonapp />
    </>
  );
}

export default Home;
