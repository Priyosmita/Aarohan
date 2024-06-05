import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import Logo from "../../assets/landing/Logo.png";

const Footer = () => {
  return (
    <div data-aos="fade-up" className="bg-cyan-100">
      <section className="max-w-[1200px] mx-auto">
        <div className=" grid md:grid-cols-3 py-5">
          {/* company details */}
          <div className=" py-8 px-4 ">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center text-cyan-950 gap-3">
              <img src={Logo} alt="Logo" className="w-20" />
              Aarohan
            </h1>
            <p className=" font-medium text-cyan-800 ">
            Learning redefined, connections amplified.
            </p>
            <br />
            <div className="flex items-center text-cyan-900 gap-3">
              <FaLocationArrow />
              <p>Kolkata,India</p>
            </div>
            <div className="flex items-center text-cyan-900 gap-3 mt-3">
              <FaMobileAlt />
              <p>+91 ...</p>
            </div>
            {/* Social Handle */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl text-cyan-800" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl text-cyan-800" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl text-cyan-800" />
              </a>
            </div>
          </div>
          {/* footer links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10 ">
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl text-cyan-900 font-bold sm:text-left text-justify mb-3">
                   Important Links
                </h1>
                <ul className={`flex flex-col gap-3`}>
                  <a href="/Login">
                  <li className="cursor-pointer text-cyan-700">Login</li>
                  </a>
                  <a href="/Signup">
                  <li className="cursor-pointer text-cyan-700">Signup</li>
                  </a>
                </ul>
              </div>
            </div>
            <div className="">
              
            </div>
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-cyan-900 text-xl font-bold sm:text-left text-justify mb-3">
                  Links
                </h1>
                <ul className="flex flex-col gap-3 text-cyan-700">
                  <a href="/Login">
                  <li className="cursor-pointer">Login</li>
                  </a>
                  <a href="/Signup">
                  <li className="cursor-pointer">Signup</li>
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="text-center text-cyan-900 py-10 border-t-2 border-gray-300/50">
            @copyright 2024 || Aarohan
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;