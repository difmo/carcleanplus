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
import HeaderCard from "./Cardheader.jsx";
import Faq from "./Pages/Faq.jsx";

// primaryColor: #092b3d
// secondryColor : #ffd101

function Home() {
  return (
    <>
      <div id="home" className="section">
        <ImageSlide />
        {/* <HeaderCard /> */}
        <About />
        <Card />
        {/* <HowCanhelpComponent /> */}
        {/* <LatestNewsComponent /> */}
        {/* <LogoComponent /> */}
        {/* <Faq /> */}
        <ContactComponent />
      </div>
    </>
  );
}

export default Home;
