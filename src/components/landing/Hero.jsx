import React, { useState, useEffect } from "react";
import Study1 from "../../assets/landing/girlStudying.png";
import Study2 from "../../assets/landing/girlBoy.png";
import Study3 from "../../assets/landing/groupStudy.png";
import Wave from "../../assets/landing/wave.png";
import { Link } from "react-router-dom"

const ImageList = [Study1, Study2, Study3];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % ImageList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const bgImage = {
    backgroundImage: `url(${Wave})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  };

  return (
    
      <div className="min-h-screen  bg-gray-100 " style={bgImage}>
        <div className="min-h-screen backdrop-blur-md flex justify-center items-center">
          <div className="container mt-48 pb-8 sm:pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* text content section */}
              <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1">
                <h1
                  data-aos="zoom-out"
                  className="text-5xl sm:text-6xl lg:text-7xl text-cyan-950 font-bold"
                >
                  Learn Today, <br />
                  <span className="text-cyan-800">Lead Tomorrow!</span>
                  
                </h1>
                <p className="text-lg font-medium font-poppins ">
                Revolutionize your learning experience with our cutting-edge virtual learning platform <span className="text-xl text-cyan-950 font-semibold font-sans">Aarohan</span>. Dive into interactive classrooms, stay organized with personalized dashboards, and receive guidance from mentors dedicated to your academic growth
                </p>

                <div data-aos="fade-up" data-aos-delay="300">
                 <Link to="/Login">
                  <button className="bg-gradient-to-r from-primary to-white hover:scale-105 duration-200 text-cyan-950 font-bold py-2 px-4 rounded-full border-2 border-cyan-950">
                    Explore
                  </button>
                  </Link>
                </div>
                
                
              </div>
              {/* Image section */}
              <div className="min-h-[400px] flex justify-center items-center relative order-1 sm:order-2">
                <div data-aos="fade-left" data-aos-delay="300">
                  <img
                    src={ImageList[currentImageIndex]}
                    alt="study img"
                    className="max-w-[430px] hover:scale-105 duration-300 w-full mx-auto drop-shadow-[-6px_20px_15px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Hero;
