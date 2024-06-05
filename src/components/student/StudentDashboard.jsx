
import React,{useState,useEffect} from 'react';
import LeftSidebar from '../common/Sidebars/LeftSidebar';
import Navbar from '../common/Navbar';
import { useLoaderData } from 'react-router-dom'
import { faHome, faTasks , faSearch, faEnvelope, faChartBar,faTimeline,faSpinner} from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../Backend_url';

const StudentDashboard = () => {
  const menuItems = [
    { name: "Analytics", route: "Student-Analytics" },
    { name: "My Courses", route: "Student-My-Courses" },
    { name: "Todo", route: "Student-Todo" },
    { name: "Find Courses", route: "Student-Find-Courses" },
    { name: "Ask Doubt", route: "Student-Ask-Doubt" },  
    { name: "My Roadmap", route: "Student-Roadmap" },
    { name: "Generate Roadmap", route: "Generate-Roadmap"}
  ];
  const title = "Student Dashboard";
  // const [user, setUser] = useState({});
  // const [user, setUser] = useState({});
  // Define icons for menu items
  const icons = [faChartBar,faHome, faTasks, faSearch, faEnvelope, faTimeline,faSpinner];
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
        <Navbar avatar={avatar} name={name} isStudent={true}/>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

export const studentInfoLoader = async () => {
  try {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      console.error("Access token not found");
      return null;
    }

    const response = await axios.get(`${Backend_url}/api/v1/users/get-current-student`, {
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
