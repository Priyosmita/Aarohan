
import React,{useState,useEffect} from 'react';
import LeftSidebar from '../common/Sidebars/LeftSidebar';
import NavbarMentor from '../common/NavbarMentor';
import { useLoaderData } from 'react-router-dom'
import { faHome, faUser, faSearch, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../Backend_url';

const MentorDashboard = () => {
  const menuItems = [
    { name: "My Courses", route: "Mentor-My-Courses" },
    { name: "Todo", route: "Mentor-Todo" },
    { name: "Create Course", route: "Create-Courses" },
    { name: "Solve Doubts", route: "Mentor-Answer-Doubts" },
  ];
  const title = "Mentor Dashboard";
  // const [user, setUser] = useState({});
  // const [user, setUser] = useState({});
  // Define icons for menu items
  const icons = [faHome, faUser, faSearch, faEnvelope];
  const data = useLoaderData()
  // console.log(data.data)
  const [avatar,setAvatar] = useState()
  const [name,setName] = useState()

  useEffect(() => {
    setAvatar(data.data.avatar)
    setName(data.data.fullName)
  }, [data.data.avatar,data.data.fullName])


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      <div className="flex flex-1">
        <LeftSidebar menuItems={menuItems} title={title} icons={icons}/>
        <div className="flex-1 overflow-y-auto">
        <NavbarMentor avatar={avatar} name={name} isStudent={false} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;

export const MentorInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/users/get-current-mentor`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
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
