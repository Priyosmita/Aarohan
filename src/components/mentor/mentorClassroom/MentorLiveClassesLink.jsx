import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';



const MentorLiveClassesLink = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [livelink, setLivelink] = useState([]);
  const [selectedLivelink, setSelectedLivelink] = useState(null);

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

  const getLiveClassInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/live-classes/get-all-live-classes?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.success) {
        const liveClasses = response.data.data;
        return liveClasses;
      } else {
        console.error("Error fetching live Classes : ", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching live Classes :", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLiveClassInfo();
      if (data) {
        setLivelink(data);
      }
    };
    fetchData();
  }, [classId]);

  const deleteLiveClass = async (link) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      const response = await axios.delete(`${Backend_url}/api/v1/live-classes/delete-live-class?classId=${classId}&liveClassId=${link._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.success) {
        window.location.reload();
      }
    }
    catch (error) {
      console.error("Error deleting live Classes :", error);
    }
  }

  const handleCreateLiveClassClick = () => {
    navigate(`/Mentor-Classroom/${classId}/Create-Live-Class`);
  };

  const joinClass = (liveClassId) => {
    navigate(`/Mentor-Classroom/${classId}/Live-Class/${liveClassId}`);
  }

  


  return (

    <>
      <div className='mt-5 flex justify-center' >
        <button onClick={handleCreateLiveClassClick} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"><FontAwesomeIcon icon={faPlus} className="mr-3" />Create New Live Class</button>
      </div>
      {livelink.map((link) => (
        <div key={link._id} className="cursor-pointer 
               bg-cyan-50  hover:scale-105 duration-200 
                 shadow-md rounded-lg   p-4 mx-8 my-8">
          <h1 className="text-xl text-cyan-950 font-semibold ">{link.topic}</h1>
          <p className="text-sm text-cyan-800 mb-2">Starts on : {new Date(link.startTime).toLocaleString()}</p>
          <p className="text-sm text-cyan-800 mb-2">Ends on : {new Date(link.endTime).toLocaleString()}</p>
          <p className="text-sm text-cyan-800 mb-2">Posted on : {new Date(link.createdAt).toLocaleString()}</p>
          {new Date(link.endTime)>new Date() && new Date(link.startTime)<new Date() &&(<p className="text-sm text-cyan-800 mb-2">Status : Live</p>)}
          {new Date(link.endTime)<new Date() &&(<p className="text-sm text-cyan-800 mb-2">Status : Over</p>)}
          {new Date(link.startTime)>new Date() &&(<p className="text-sm text-cyan-800 mb-2">Status : Upcoming</p>)}
          <div className="flex justify-between">
            
              
              <button onClick={() => joinClass(link._id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                <FontAwesomeIcon icon={faEye} className="mr-2" />Join
              </button>
              <button onClick={() => deleteLiveClass(link)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Delete
              </button>
            
          </div>
        </div>
      ))}
    </>

  );
};

export default MentorLiveClassesLink;

