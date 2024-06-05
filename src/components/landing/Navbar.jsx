import React from "react";
import Logo from "../../assets/landing/Logo.png";
import { Link } from "react-router-dom";



function Navbar() {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999 }}>
      <div className="shadow-xl bg-cyan-700 ">
        <div className="container w-auto">
          <div className="flex justify-between items-center w-full">
            <div>
              <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
                <img src={Logo} alt="Logo" className="w-16 py-1 pl-1 rounded-full ml-16 my-1" />
                <span className="text-xl font-bol text-cyan-50 my-5 ml-1 mr-0">Aarohan</span>
              </Link>
            </div>
            {/* Shifting contents to the right */}
            <div className="flex justify-end items-center gap-4 flex-grow">
              {/* <ul className="hidden sm:flex items-center gap-4">
                {Menu.map((menu) => (
                  <li key={menu.id}>
                    <a
                      href={menu.path}
                      className="inline-block text-cyan-800 font-semibold py-4 px-4 hover:text-primary duration-300"
                    >
                      {menu.title}
                    </a>
                  </li>
                ))}
              </ul> */}
              <Link to="/Login">
                <button
                  className="bg-cyan-100 ml-20 hover:scale-105 duration-200 
              font-semibold
              text-cyan-700 py-2 px-4 rounded-md hover:bg-cyan-300 "
                >
                  Login
                </button>
              </Link>
              <Link to="/Signup">
                <button
                  className="bg-cyan-100 hover:scale-105 duration-200 
              font-semibold 
              text-cyan-700 py-2 px-4 ml-4 rounded-md hover:bg-cyan-300 "
                >
                  Signup
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
