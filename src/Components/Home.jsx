import React from "react";
import HeroSection from "./HeroSection";
import TrustStats from "./TrustStats";
import ServicesPricing from "./ServicesPricing";
import HowItWorks from "./HowItWorks";
import WhyChouseUsComponents from "./WhyChouseUsComponents";
import BeforeAfterGallery from "./BeforeAfterGallery";
import Testimonials from "./Testimonials";
import BookingModal from "./BookingFlow/BookingModal";
import Footer from "./Footer"; // Assuming footer exists

function Home() {
  return (
    <>
      <div id="home" className="section bg-secondary min-h-screen relative">
        <HeroSection />
        <TrustStats />
        <ServicesPricing />
        <WhyChouseUsComponents />
        <BeforeAfterGallery />
        <HowItWorks />
        <Testimonials />
        
        {/* The Modal will only show when isModalOpen is true in Context */}
        <BookingModal />
      </div>
    </>
  );
}

export default Home;
