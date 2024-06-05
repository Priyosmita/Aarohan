

import axios from "axios";
import ErrorBox from "../common/Error.jsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../landing/Navbar.jsx";
import { Backend_url } from "../../../Backend_url.js";
import Image from "../../assets/Images/signUp.jpg";

const LogIn = () => {
  // State variables to store form inputs
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  // const apiUrl = process.env.REACT_APP_API_URL;

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${Backend_url}/api/v1/users/login`,
        {
          email: email,
          password: password,
        }
      );
      document.cookie = `accessToken=${response.data.data.accessToken}; path=/;`;
      document.cookie = `refreshToken=${response.data.data.refreshToken}; path=/;`;
      if (response?.data.data.user.role === "student") {
        navigate("/Student-My-Courses");
      }
      if (response?.data.data.user.role === "mentor") {
        navigate("/Mentor-My-Courses");
      }
    } catch (error) {
      // console.error(error);
      // console.log('Status Code:', error.response.status);
      if (error.response?.status === 404) {
        setErrorMessage("User not found, Please sign up first");
      } else if (error.response?.status === 401) {
        setErrorMessage("Wrong email or password");
      } else {
        setErrorMessage("Server error. Please try again later");
      }
      setError(true);
    }
  };

  const handleCloseError = () => {
    setError(false);
  };

  return (

    <div className= "flex flex-col h-screen overflow-hidden">
      <Navbar />
    
    <div className="flex flex-row flex-wrap h-screen">
      <div className=" flex-1 w-2/5 justify-center items-center mt-40 ">
        <img src={Image} alt="class" />
      </div>

      <section className="bg-cyan-200 dark:bg-gray-900 bg-cover bg-center w-3/5  ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 ">
          <div className="w-full mt-40 bg-cyan-50 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                className="text-2xl font-semibold 
            leading-tight tracking-tight text-cyan-900 md:text-2xl dark:text-white"
              >
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <ErrorBox
                    errorMessages={errorMessage}
                    onClose={handleCloseError}
                  />
                )}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-cyan-800 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="write your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-cyan-800 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-fit text-white bg-cyan-700 hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign in
                  </button>
                </div>

                <div className="flex justify-center">
                  <p className="text-m font-light text-cyan-800 dark:text-gray-400">
                    Don’t have an account yet?{" "}
                    <a
                      href="/Signup"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Sign up
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default LogIn;


