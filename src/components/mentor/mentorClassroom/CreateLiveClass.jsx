import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const CreateLiveClass = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form Data:', description, fullMarks, deadline, file);
    if (!topic || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      
    //   console.log('Form Data:', topic, startTime, endTime);
      const response = await axios.post(`${Backend_url}/api/v1/live-classes/create-live-class?classId=${classId}`, 
      {
        topic: topic,
        startTime: startTime,
        endTime: endTime,
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.success) {
        navigate(`/Mentor-Classroom/${classId}/Live-Classes`);
      } else {
        alert('Error creating Live Class');
      }
    } catch (error) {
      console.error("Error creating Live Class:", error);
    }

    // Reset form fields
    setEndTime('');
    setTopic('');
    setStartTime('');
  };

  return (
    <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", overflowX: "hidden" ,paddingTop:"60px"}}>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-cyan-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Topic
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              id="topic"
              placeholder="Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Starts On
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Ends On
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Live Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLiveClass;
