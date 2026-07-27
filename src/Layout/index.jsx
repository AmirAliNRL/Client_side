import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[100svh] pt-[70px]">
        <Outlet />
      </main>
      
      <Footer/>
    </>
  );
}
