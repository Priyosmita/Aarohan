
import React, { useState, useEffect } from 'react';
import LeftSidebar from '../../common/Sidebars/LeftSidebar';
import Navbar from '../../common/Navbar';
import { faBook, faRectangleList, faDesktop, faMessage,faBackward, faFileCirclePlus, faChartSimple } from '@fortawesome/free-solid-svg-icons';
import RightSidebar from '../../common/Sidebars/RightSidebar';
import { Outlet } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const StudentClassroom = () => {
  const { classId } = useParams();
  
  // const title = "English Class";
  const icons = [faBackward,faBook, faChartSimple,faRectangleList, faDesktop, faMessage,faFileCirclePlus];
  // const participants = ["Participant 1", "Participant 2", "Participant 3"];
  // const teacherName = "John Doe";
  // const isTeacherDashboard = false; // Example
  // const thumbnail = "https://images.pexels.com/photos/7521314/pexels-photo-7521314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  const data = useLoaderData()

  const [avatar, setAvatar] = useState()
  const [name, setName] = useState()
  const [isTeacherDashboard, setIsTeacherDashboard] = useState()
  const [class_Info, setClass_Info] = useState()

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

  const getClassInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/classes/get-my-class-dashboard-student?id=${classId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.success) {
        const classData = response.data.data;
        const ownerInfo = {
          _id: classData.owner._id,
          username: classData.owner.username,
          email: classData.owner.email,
          fullName: classData.owner.fullName,
          contactNo: classData.owner.contactNo,
          DOB: classData.owner.DOB,
          address: classData.owner.address,
          language: classData.owner.language,
          institution: classData.owner.institution,
          standard: classData.owner.standard,
          avatar: classData.owner.avatar,
          role: classData.owner.role,
          createdAt: classData.owner.createdAt,
          updatedAt: classData.owner.updatedAt
        };

        const classInfo = {
          _id: classData.class._id,
          classname: classData.class.classname,
          thumbnail: classData.class.thumbnail,
          title: classData.class.title,
          description: classData.class.description,
          category: classData.class.category,
          createdAt: classData.class.createdAt,
          updatedAt: classData.class.updatedAt
        };

        const membersInfo = classData.members.map(member => ({
          _id: member.memberInfo._id,
          username: member.memberInfo.username,
          email: member.memberInfo.email,
          fullName: member.memberInfo.fullName,
          contactNo: member.memberInfo.contactNo,
          DOB: member.memberInfo.DOB,
          address: member.memberInfo.address,
          language: member.memberInfo.language,
          institution: member.memberInfo.institution,
          standard: member.memberInfo.standard,
          avatar: member.memberInfo.avatar,
          role: member.memberInfo.role,
          createdAt: member.memberInfo.createdAt,
          updatedAt: member.memberInfo.updatedAt
        }));
        const info = { ownerInfo, classInfo, membersInfo };

        return info;

      } else {
        console.error("Error fetching mentors:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      return null;
    }
  };

  useEffect(() => {
    setAvatar(data.data.avatar)
    setName(data.data.fullName)
    setIsTeacherDashboard(data.data.role === "mentor")
    const fetchData = async () => {
      const data = await getClassInfo();
      if (data) {
        setClass_Info(data);
      }
    };
    fetchData();
  }, [data.data.avatar, data.data.fullName])

  const menuItems = [
    { name: "Dashboard", route:`Student-My-Courses` },
    { name: "Materials", route: `Student-Classroom/${class_Info?.classInfo._id}/Materials` },
    { name: "Class Analysis", route: `Student-Classroom/${class_Info?.classInfo._id}/Class-Analysis`},
    { name: "Assignments", route: `Student-Classroom/${class_Info?.classInfo._id}/Assignments` },
    { name: "Live Classes", route:`Student-Classroom/${class_Info?.classInfo._id}/Live-Classes` },
    { name: "Ask Doubts", route: `Chat/${class_Info?.ownerInfo._id}` },
    { name: "Give Feedback", route: `Student-Classroom/${class_Info?.classInfo._id}/Feedback` }
    
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar avatar={avatar} name={name} isStudent={true}
      />
      <div className="flex flex-1">
        <LeftSidebar menuItems={menuItems} title={class_Info?.classInfo.classname} icons={icons} thumbnail={class_Info?.classInfo.thumbnail} id={class_Info?.classInfo._id} />
        <div className="flex-1 overflow-y-auto" style={{background:"#cffafe"}}>

          <Outlet />
        </div>
        <RightSidebar
          participants={class_Info?.membersInfo}
          teacherName={class_Info?.ownerInfo.fullName}
          isTeacherDashboard={isTeacherDashboard}
          teacherAvatar={class_Info?.ownerInfo.avatar}
          classId={class_Info?.classInfo._id}
        />
      </div>
    </div>
  );
};

export default StudentClassroom;
