import React from "react";
import MentorList from "./MentorList";
import { useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Backend_url } from "../../../../Backend_url";

// const mentors = [
//   { id: 1, name: "Hitesh Choudhary", expertise: "Mathematics", image: "https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
//   { id: 2, name: "Abhinash Khatri", expertise: "Mathematics", image: "https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
//   { id: 3, name: "Raghav Juyal", expertise: "Mathematics", image: "https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
//   { id: 4, name: "Nitin Garg", expertise: "Mathematics", image: "https://images.pexels.com/photos/5212321/pexels-photo-5212321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"},
  
// ];

const AskDoubts = () => {
  const [data, setData] = useState({});
  const [mentors, setMentors] = useState([]);
  const data1 = useLoaderData()
  useEffect(() => {
      setData(data1);
      setMentors(data1);
  }, []);


  return (
    <div
      className="container "
      style={{
        height: "calc(100vh - 4.3rem)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "scroll",
        overflowX: "hidden",
        background: "#cffafe",

      }}
    >
      <h1 className="text-3xl font-light mb-4 mt-20 font-poppins text-cyan-900">
        Connect To Mentors
      </h1>

      <MentorList mentors={mentors} />
    </div>
  );
};

export default AskDoubts;

export const findAllMentors = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/classes/get-all-mentors-for-student?input=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.data && response.data.success) {
      const mentors = response.data.data.map(mentor => ({
        _id: mentor._id,
        avatar: mentor.avatar,
        email: mentor.email,
        fullName: mentor.fullName,
        role: mentor.role
      }));
      return mentors;
    } else {
      console.error("Error fetching mentors:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return null;
  }
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
