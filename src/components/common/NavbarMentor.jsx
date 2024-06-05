
import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/landing/Logo.png";
import { Link } from "react-router-dom";

const NavbarMentor = ({ avatar, name }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/MentorProfile");
  }

  return (
    <nav className="bg-cyan-700 border-cyan-200 shadow-xl  ">
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
        <a  className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer" onClick={handleClick}
        >
          <img src={avatar || "https://i.pinimg.com/originals/6b/04/07/6b0407038d60870236e72d0e7b0a244b.png"} className="h-8 rounded-full" alt="profile image" />
          <span className="  self-center text-xl font-semibold font-poppins whitespace-nowrap text-cyan-50">
            {name || "Haruki Shiga"}
          </span>
        </a>
        </div>
        {/* <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-cyan-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button> */}
        {/* <div className="hidden w-full md:block md:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 ">
            <li className="mt-2 bg-amber-100 p-2 rounded-md">
              <a
                href="/components/student/StudentDashboard"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-gray-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                aria-current="page"
              >
                Dashboard
              </a>
            </li>
            
            
          </ul>
        </div> */}
      </div>
    </nav>
  );
};

export default NavbarMentor;
