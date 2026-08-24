// App.js

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar"; // Correct the spelling of Navbar
import Footer from "./Components/Footer";
import Home from "./Components/Home"; // This will contain sections like About, FAQ, etc.
import PrivacyPolicy from "./Components/Pages/PrivacyPolicy";
import Disclaimer from "./Components/Pages/Disclaimer";
import TermsofService from"./Components/Pages/TermsofService";
import HelpSupport from "./Components/Pages/HelpSupport";
import Faq from "./Components/Pages/Faq";
import Gallery from "./Components/Pages/Gallery";
import Login from "./Components/Pages/Login";

import PricingPage from "./Components/Pages/PricingPage";
import BookingModal from "./Components/BookingFlow/BookingModal";
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminBookings from "./Components/Admin/Bookings/AdminBookings";
import AdminContacts from "./Components/Admin/Contacts/AdminContacts";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <BookingModal />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes (No public Navbar/Footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>

        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/termsofservice" element={<TermsofService/>} />
          <Route path="/helpsupport" element={<HelpSupport/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

