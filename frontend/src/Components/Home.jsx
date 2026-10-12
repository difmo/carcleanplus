import React from "react";
import HeroSection from "./HeroSection";
import TrustStats from "./TrustStats";
import OfferSection from "./OfferSection";
import ServicesPricing from "./ServicesPricing";
import WaterElectricityPromoBanner from "./WaterElectricityPromoBanner";
import MonthlyMembership from "./MonthlyMembership";
import HowItWorks from "./HowItWorks";
import WhyChouseUsComponents from "./WhyChouseUsComponents";
import BeforeAfterGallery from "./BeforeAfterGallery";
import ContactComponent from "./ContactComponent";

import Testimonials from "./Testimonials";
import Footer from "./Footer"; // Assuming footer exists

function Home() {
  return (
    <>
      <div id="home" className="section bg-white min-h-screen relative">
        <HeroSection />
        <TrustStats />

        {/* Water & Electricity Discount Banner (Client Point 2) */}
        <WaterElectricityPromoBanner />

        <WhyChouseUsComponents />

        {/* Offer Section handles the #offer id */}
        <OfferSection />

        <div id="packages">
          <ServicesPricing />
        </div>

        {/* Monthly Membership Section (Client Point 3) */}
        <div id="memberships">
          <MonthlyMembership />
        </div>

        <div id="gallery">
          <BeforeAfterGallery />
        </div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <ContactComponent />

      </div>
    </>
  );
}

export default Home;
