
import React, { useEffect, useState } from 'react';
import Courses from "../common/Courses";
import { Backend_url } from '../../../Backend_url';
// import { studentAllCoursesInfoLoader } from './studentAllCoursesInfoLoader';
import { useLoaderData } from 'react-router-dom'

import axios from 'axios';

function FindCourses() {
  const joinClass = "Join Class";

  const [data, setData] = useState([]);

  useEffect(() => {
    studentAllCoursesInfoLoader().then(data => {
      setData(data);
    });
  }, []);

  return (
    <div style={{
      height: "calc(100vh - 4.3rem)",
      width: "100%",
      display: "flex",
      flexDirection:"column",
      alignItems: "center",
      overflowY: "scroll",
      overflowX: "hidden",
      background:"#cffafe"
    }}>
      <h1 className="text-3xl font-light text-slate-700 font-poppins mt-11">Find Courses Specially Designed For You</h1>
      <Courses courses={data} joinORgo={joinClass} />
    </div>
  );
}

export default FindCourses;


export const studentAllCoursesInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/classes/get-all-classes-for-student?input=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const classes = response.data.data.map(classData => ({
      id: classData._id,
      classname: classData.classname,
      title: classData.title,
      category: classData.category,
      ownerId: classData.owner[0]._id,
      ownerName: classData.owner[0].fullName,
      ownerEmail: classData.owner[0].email,
      description: classData.description,
      thumbnail: classData.thumbnail,
      memberCount: classData.membersCount
    }));

    return classes;
  } catch (error) {
    console.error(error);
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
