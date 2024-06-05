import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/landing/Logo.png";
import { Link } from "react-router-dom";

const Navbar = ({ avatar, name, isStudent }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isStudent) navigate("/StudentProfile");
    else navigate("/MentorProfile");
  };

  return (
    <nav className="bg-cyan-700 border-cyan-200 shadow-xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto py-0 px-2 ">
        <div>
          <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
            <img
              src={Logo}
              alt="Logo"
              className="w-16 py-1 pl-1 rounded-full my-1"
            />
            <span className="text-xl font-bol text-cyan-50 my-5 ml-1 mr-0">
              Aarohan
            </span>
          </Link>
        </div>


        <div className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
         

          <a className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={handleClick}>
            <span className="self-center text-xl font-medium font-poppins whitespace-nowrap text-cyan-50 ">
              {name || "Haruki Shiga"}
            </span>
            <img
              src={avatar || "https://i.pinimg.com/originals/6b/04/07/6b0407038d60870236e72d0e7b0a244b.png"}
              className="h-10 rounded-full border-2 border-cyan-50 m-3"
              alt="profile image"

            />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
