import React from "react";
import { useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import StudentList from "./StudentList";
import { Backend_url } from "../../../../Backend_url";



const SolveDoubts = () => {
  const [data, setData] = useState({});
  const [students, setStudents] = useState([]);
  const data1 = useLoaderData()
  useEffect(() => {
      setData(data1);
      setStudents(data1);
  }, []);


  return (
    <div
      className="container px-4 py-8"
      style={{
        height: "calc(100vh - 4.3rem)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "scroll",
        overflowX: "hidden",
        background:"#cffafe"
      }}
    >
      <h1 className="text-3xl font-light mb-4 font-poppins ">
        Connect To Mentors
      </h1>

      <StudentList students={students} />
    </div>
  );
};

export default SolveDoubts;

export const findAllDoubtsStudents = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/classes/get-students-having-doubts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    // console.log(response.data);
    if (response.data && response.data.success) {
      const students = response.data.data.map(student => ({
        _id: student.senderInfo._id,
        avatar: student.senderInfo.avatar,
        email: student.senderInfo.email,
        fullName: student.senderInfo.fullName,
        role: student.senderInfo.role
      }));
      return students;
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
