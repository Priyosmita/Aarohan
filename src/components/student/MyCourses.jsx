
import React from 'react'
import Courses from '../common/Courses'
import { useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Backend_url } from '../../../Backend_url';



function MyCourses() {
    const [courses, setCourses] = useState([]);
    const data1 = useLoaderData()
  
    useEffect(() => {
        setCourses(data1);
    }, []);

//     const courses = [
//       {id:1,classname:"English",ownerName:"Mr.Anjan Bose",description:"This is the course description",thumbnail:"https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",title:"demo Title",category:"demo Category",memberCount:10},
//     {id:2,classname:"Bengali",ownerName:"Papiya Bakshi",description:"This is the course description",thumbnail:"https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",code:"f67d",title:"demo Title",category:"demo Category",memberCount:50},
    

// ]

const goToClass = "Go to Class"

  return (
    <div style={{height: "calc(100vh - 4.3rem)",
    width: "100%",
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "hidden",
    background:"#cffafe"}}>
        <Courses courses = {courses} joinORgo={goToClass} isStudent={true}/>
        </div>
  )
}

export default MyCourses

export const studentMyCoursesInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/classes/get-my-classes-for-student?input=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const classes = response.data.data.map(classData => ({
      id: classData.class,
      classname: classData.classInfo[0].classname,
      title: classData.classInfo[0].title,
      category: classData.classInfo[0].category,
      ownerId: classData.ownerInfo[0]._id,
      ownerName: classData.ownerInfo[0].fullName,
      // ownerEmail: classData.ownerInfo[0].email,
      description: classData.classInfo[0].description,
      thumbnail: classData.classInfo[0].thumbnail
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

