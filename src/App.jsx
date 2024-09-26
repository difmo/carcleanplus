import { useState } from "react";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Navebar from "./Components/Navebar";
import Footer from "./Components/Footer";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navebar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/about" Component={About} />
          <Route path="/contact" Component={Contact} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
