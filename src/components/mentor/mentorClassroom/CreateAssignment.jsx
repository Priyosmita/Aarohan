import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const UploadAssignment = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [fullMarks, setFullMarks] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form Data:', description, fullMarks, deadline, file);
    if (!description || !fullMarks || !deadline || !file) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      

      const response = await axios.post(`${Backend_url}/api/v1/assignments/create-assignment?classId=${classId}`, {
        description: description,
        fullmarks: fullMarks,
        deadline: deadline,
        file: file
      
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.success) {
        navigate(`/Mentor-Classroom/${classId}/Assignments`);
      } else {
        alert('Error creating assignment');
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
    }

    // Reset form fields
    setDescription('');
    setFullMarks('');
    setDeadline('');
    setFile(null);
  };

  return (
    <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", overflowX: "hidden" ,paddingTop:"60px"}}>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-cyan-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullMarks">
              Full Marks
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fullMarks"
              type="text"
              placeholder="Full Marks"
              value={fullMarks}
              onChange={(e) => setFullMarks(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              Deadline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Upload File
            </label>
            <input
              className="appearance-none block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow"
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAssignment;
