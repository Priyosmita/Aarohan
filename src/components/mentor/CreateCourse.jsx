import React, { useState } from 'react';
// import { navigate } from 'react-router-dom';
import axios from 'axios';
import ErrorBox from "../common/Error.jsx";
import { Backend_url } from '../../../Backend_url.js';



const MentorClassroom = () => {
  // State for form fields
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);
  const [style, setStyle] = useState('');
  const [formData, setFormData] = useState({
    classname: '',
    image: null,
    title: '', // Change to null since it will hold the file object
    description: '',
    category: ''
  });

  // Handler function to update form fields
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const file = e.target.files[0];
      // Set preview image
      setFormData((prevState) => ({
        ...prevState,
        thumbnail: file,
        previewImage: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handler function for form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }
      const response = await axios.post(
        `${Backend_url}/api/v1/classes/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      // console.log('Response:', response.data);
      // Handle successful registration
      setStyle("bg-green-100 border-green-400 text-green-700");
      setErrorMessage("Class Created Successfully");
      setError(true);
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

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  return (
    <div 
    style={{
      height: "calc(100vh - 4.3rem)",
      width: "100%",
      display: "flex",
      
      flexDirection: "column",
      alignItems: "center",
      overflowY: "scroll",
      overflowX: "hidden",
      background:"#cffafe"
    }}>
     
      
        
        <div>
          <div className=" mx-auto px-4 py-8 ">
            <h1 className="text-3xl font-bold text-cyan-900 mb-6 text-center">Create Classroom</h1>
            <div className="mx-auto bg-cyan-50 rounded-lg p-10" style={{width:"100%"}}>
              <form onSubmit={handleSubmit} className="w-full">
              {style==="" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} />)}
              {style!=="" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} style={style} />)}
                <div className="mb-4">
                  <label htmlFor="classname" className="block text-cyan-700 font-bold mb-2">Name</label>
                  <input type="text" id="classname" name="classname" value={formData.classname} onChange={handleChange} className="w-full border  rounded-md py-2 px-3 focus:outline-none bg-cyan-100" placeholder="Enter Name" />
                </div>
                <div className="mb-4">
                  <label htmlFor="image" className="block text-cyan-700 font-bold mb-2 ">Image</label>
                  <input
                className=" bg-cyan-100 text-cyan-900 sm:text-sm rounded-lg focus:ring-0  block w-full p-2  placeholder-cyan-600 focus:border-cyan-200 focus:outline-none mb-2"
                    placeholder="Profile Picture"
                type="file"
                accept="image/*"
                name="avatar"
                onChange={handleChange}
              />

              {formData.previewImage && (
                <div className="flex justify-center  mt-2 mb-2">
                  <img
                    src={formData.previewImage}
                    alt="Preview"
                    className="w-auto h-32 "
                  />
                </div>
              )}
                </div>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-cyan-700 font-bold mb-2">Title</label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full border bg-cyan-100 rounded-md py-2 px-3 focus:outline-none" placeholder="Enter Category" />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-cyan-700 font-bold mb-2">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full border  rounded-md py-2 px-3 focus:outline-none bg-cyan-100 resize-none" rows="4" placeholder="Enter Description"></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="category" className="block text-cyan-700 font-bold mb-2">Category</label>
                  <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} className="w-full border bg-cyan-100 rounded-md py-2 px-3 focus:outline-none " placeholder="Enter Category" />
                </div>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-800 text-cyan-50 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Create Class
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default MentorClassroom;