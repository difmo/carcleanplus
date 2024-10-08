import React from "react";
import NavFooter from "./NavFooter";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

function LayOut({ children }) {
  return (
    <>
      <NavFooter />
      <main>{children}</main>
      <Outlet/>
      <Footer />
    </>
  );
}

export default LayOut;
