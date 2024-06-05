
import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import Services from "../components/landing/Services";
import Banner from "../components/landing/Banner";
import Testimonial from "../components/landing/Testimonial";
import Footer from "../components/landing/Footer";

function LandingPage() {
  React.useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  });
  return (
    <div>
      <Navbar />

      <Hero />

      <Services />

      <Banner />

      <Testimonial />
      <Footer />
    </div>
  );
}

export default LandingPage;

