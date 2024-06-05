

import React, { useState } from "react";
import ErrorBox from "../common/Error.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../landing/Navbar.jsx";
import { Backend_url } from "../../../Backend_url.js";
import Image from "../../assets/Images/Register.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    contactNo: "",
    dob: "",
    address: "",
    language: "Hindi",
    institution: "",
    standard: "",
    role: "",
    sections: "",
    profilePic: null,
    previewImage: null,
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      // Set preview image
      setFormData((prevState) => ({
        ...prevState,
        avatar: file,
        previewImage: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${Backend_url}/api/v1/users/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log('Response:', response.data);
      // Handle successful registration
      navigate("/Login");
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("All fields are required");
      } else if (error.response?.status === 409) {
        setErrorMessage("User already exists");
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
    <div className="flex flex-row flex-wrap h-screen ">
      
      <div className="w-full md:w-1/4 bg-gray-200 flex items-center justify-center  max-h-screen overflow-hidden container relative  text-center">
     
      <img src={Image} alt="class" style={{height:"100vh" ,width:"768px"}} />
      

      </div>

      <section className="w-full md:w-3/4 bg-cyan-200 h-screen dark:bg-gray-900 bg-cover bg-center  overflow-y-scroll">
        <div className="flex items-center justify-center my-10 px-6 py-11 md:py-0">
          <div className="py-10  px-10   mt-24  bg-cyan-50  rounded-lg shadow-md dark:border dark:border-gray-700 mb-20 h-fit">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-cyan-900 dark:text-white mb-4 text-center mt-4">
              Sign Up
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-1">
                {error && (
                  <ErrorBox
                    errorMessages={errorMessage}
                    onClose={handleCloseError}
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-800 text-sm font-bold mb-1">
                    Full Name:
                  </label>
                  <input
                    className=" bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Full Name"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-cyan-800 text-sm font-bold mb-1">
                    Email:
                  </label>
                  <input
                    className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
             
              <div>
                <label className="block text-cyan-800 text-sm font-bold mb-1">
                  Username:
                </label>
                <input
                  className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Contact No:
              </label>
              <input
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Contact No"
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
              />
            </div>
            <div >
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Date of Birth:
              </label>
              <input
                className=" bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Address:
              </label>
              <textarea
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none   resize-none"
                    placeholder="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Language:
              </label>
              <select
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
              >
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
              </select>
            </div>
            <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Role:
              </label>
              <select
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
            {formData.role === "student" && (
              <>
                <div>
                  <label className="block text-cyan-800 text-sm font-bold mb-1">
                    Institution:
                  </label>
                  <input
                    className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Institution"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-cyan-800 text-sm font-bold mb-1">
                    Standard:
                  </label>
                  <input
                    className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                    placeholder="Standard"
                    type="text"
                    name="standard"
                    value={formData.standard}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Upload Profile Picture:
              </label>
              <input
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none mb-2"
                    placeholder="Profile Picture"
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleChange}
              />

              {formData.previewImage && (
                <div className="flex justify-center mt-2 mb-2">
                  <img
                    src={formData.previewImage}
                    alt="Preview"
                    className="w-auto h-32"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-cyan-800 text-sm font-bold mb-1">
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-cyan-100  border-cyan-00 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2.5  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none "
                
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            </div>
              <div className="mb-2 text-center">
                <button
                  className="bg-cyan-700 hover:bg-cyan-500 text-white font-bold py-2 rounded-md focus:outline-none mt-5 focus:shadow-outline w-fit px-4 justify-center text-center"
                  type="submit"
                >
                  Register
                </button>
              </div>
              <div className="flex justify-center">
                <p className="py-2 font-semibold text-cyan-800">
                  Already have an account? <a href="/Login">Login</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default SignUp;

