import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowRight,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import ErrorBox from "../common/Error";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backend_url } from "../../../Backend_url";

const Courses = ({ courses, joinORgo, isStudent }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [style, setStyle] = useState("");
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if courses is null or undefined, and initialize it as an empty array if so
  const filteredCourses = courses
    ? courses.filter((course) => {
        return (
          course.classname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const joinClass = async (classId) => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    try {
      setStyle("");
      const response = await axios.post(
        `${Backend_url}/api/v1/classes/join`,
        {
          id: classId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setStyle("bg-green-100 border-green-400 text-green-700");
      setErrorMessage("Join request sent successfully");
      setError(true);
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("You are already a member of this class");
      } else if (error.response?.status === 409) {
        setErrorMessage("You have already requested to join this class");
      } else {
        setErrorMessage("Server error. Please try again later");
      }
      setError(true);
    }
  };

  // Define getCookie function here

  const navigate = useNavigate();

  const goClass = (classId) => {
    if (isStudent) {
      navigate(`/Student-Classroom/${classId}/Materials`);
    } else {
      navigate(`/Mentor-Classroom/${classId}/Materials`);
    }
  };

  const handleCloseError = () => {
    setError(false);
    setStyle("");
  };

  return (
    <div className="m-20 w-5/6 ">
      <div className="flex items-center mb-14 justify-center">
        <div className="relative w-3/6">
          <input
            type="text"
            placeholder="Search courses..."
            className=" border-none rounded-l-md  focus:ring-0 focus:outline-none py-2 px-4 pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-cyan-700" />
          </div>
        </div>
        <button className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-4 rounded-r-md focus:outline-none focus:shadow-outline">
          Search
        </button>
      </div>
      {style === "" && error && (
        <ErrorBox errorMessages={errorMessage} onClose={handleCloseError} />
      )}
      {style !== "" && error && (
        <ErrorBox
          errorMessages={errorMessage}
          onClose={handleCloseError}
          style={style}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-cyan-50 rounded-lg shadow-md overflow-hidden cursor-pointer 
                 hover:scale-105 duration-200 
                "
          >
            <img
              src={course.thumbnail}
              alt={course.classname}
              className="w-full h-40 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-cyan-950">
                {course.classname}
              </h2>
              <p className="text-cyan-700 mb-2 font-medium">
                Title: {course.title}
              </p>
              <p className="text-cyan-700 mb-2 font-medium">
                Category: {course.category}
              </p>
              <p className="text-cyan-700 mb-2 font-medium">
                {course.description}
              </p>
              <p className="text-cyan-700 mb-2 font-medium">
                Teacher: {course.ownerName}
              </p>
              {course.memberCount !== undefined && (
                <p className="text-cyan-600 mb-2">
                  Members: {course.memberCount}
                </p>
              )}
              <div className="flex justify-between">
                {joinORgo === "Join Class" && (
                  <button
                    className="mt-6 bg-cyan-600 hover:bg-cyan-800 text-cyan-50 font-semibold px-2 py-1 rounded focus:outline-none focus:shadow-outline flex items-center"
                    onClick={() => joinClass(course.id)}
                  >
                    {joinORgo}{" "}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                )}
                {joinORgo === "Go to Class" && (
                  <button
                    className="bg-cyan-600 hover:bg-cyan-800 text-cyan-50 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                    onClick={() => goClass(course.id, isStudent)}
                  >
                    {joinORgo}{" "}
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                )}
                {course.ownerEmail !== undefined && (
                  <button
                    className=" mt-6 bg-cyan-600 hover:bg-cyan-800 text-cyan-50 font-semibold px-2 py-1 rounded focus:outline-none focus:shadow-outline flex items-center"
                    onClick={() =>
                      (window.location.href = `mailto:${course.mentorEmail}`)
                    }
                  >
                    Mail Mentor{" "}
                    <FontAwesomeIcon icon={faEnvelope} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
