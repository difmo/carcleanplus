import React from "react";
import HeroSection from "./HeroSection";
import TrustStats from "./TrustStats";
import ServicesPricing from "./ServicesPricing";
import HowItWorks from "./HowItWorks";
import WhyChouseUsComponents from "./WhyChouseUsComponents";
import BeforeAfterGallery from "./BeforeAfterGallery";

import Testimonials from "./Testimonials";
import Footer from "./Footer"; // Assuming footer exists

function Home() {
  return (
    <>
      <div id="home" className="section bg-white min-h-screen relative">
        <HeroSection />
        <TrustStats />

        <WhyChouseUsComponents />

        <div id="pricing">
          <ServicesPricing />
        </div>

        <div id="gallery">
          <BeforeAfterGallery />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

      </div>
    </>
  );
}

export default Home;
