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
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Render the full homepage with all sections */}
        <Route path="/" element={<Home />} />
        {/* Full-page routes for Privacy Policy, Disclaimer, etc. */}
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/termsofservice" element={<TermsofService/>} />
        <Route path="/helpsupport" element={<HelpSupport/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

