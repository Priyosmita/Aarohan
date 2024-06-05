// Import React, useState, useEffect, axios, useParams, FontAwesomeIcon, and faEye
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const Assignments = ({ onOpenAssignmentClick }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
  // Function to fetch assignments information
  const getAssignmentsInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/assignments/get-all-assignments?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.success) {
        const materials = response.data.data;
        return materials;
      } else {
        console.error("Error fetching assignments:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      return null;
    }
  };

  // Fetch assignments data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAssignmentsInfo();
      if (data) {
        setAssignments(data);
      }
    };
    fetchData();
  }, [classId]);

  // Function to delete an assignment
  const deleteAssignment = async (assignment) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      const response = await axios.delete(`${Backend_url}/api/v1/assignments/delete-assignment?classId=${classId}&assignmentId=${assignment._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }});
      if (response.data && response.data.success) {
        window.location.reload();
      }
    }
    catch (error) {
      console.error("Error deleting assignment:", error);
    }
  }

  // Function to handle opening assignment details dialog
  const handleOpenDialog = (assignment) => {
    setSelectedAssignment(assignment);
  };

  // Function to handle closing assignment details dialog
  const handleCloseDialog = () => {
    setSelectedAssignment(null);
  };

  // Function to navigate to create assignment page
  const handleCreateAssignmentClick = () => {
    navigate(`/Mentor-Classroom/${classId}/Create-Assignment`);
  };

  // Function to navigate to view submissions page for a specific assignment
  const handleViewSubmissions = (assignmentId) => {
    navigate(`/Mentor-Classroom/${classId}/Submissions/${assignmentId}`);
  };

  return (
    <div className='w-full'  style={{height: "calc(100vh - 4.3rem)",
    width: "100%",
    display: "flex",
    
    flexDirection: "column",
    alignItems: "center",
    overflowY: "scroll",
    overflowX: "hidden",
    backgroundColor: "#cffafe",}}>
    <div className='mt-5 flex justify-center'>
      <button onClick={handleCreateAssignmentClick} className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"><FontAwesomeIcon icon={faPlus} className="mr-3" />Create New Assignment</button>
    </div>
      {assignments.map((assignment) => (
        <div key={assignment._id} className="cursor-pointer 
               bg-cyan-50  hover:scale-105 duration-200 
                 shadow-md rounded-lg   p-4 mx-8 my-8 w-11/12">
          <h1 className="text-xl text-cyan-950 font-semibold ">{assignment.description}</h1>
          <p>Full Marks: {assignment.fullmarks}</p>
          <p className="text-sm text-cyan-800 mb-2">Submission Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
          <div className="flex justify-between">
          <div>
            <button onClick={() => handleOpenDialog(assignment)} className="bg-cyan-600 hover:bg-cyan-800 text-cyan-50 mr-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Open Assignment
            </button>
            <button onClick={() => handleViewSubmissions(assignment._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              <FontAwesomeIcon icon={faEye} className="mr-2" />View Submissions
            </button>
            </div>
            <button onClick={() => deleteAssignment(assignment)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Delete</button>
            
          </div>
        </div>
      ))}
      {selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full bg-cyan-100 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-200 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{selectedAssignment.description}</h2>
            <img src={selectedAssignment.document} alt="Assignment" style={{ width: "auto", height: "400px" }} />
            <div className="flex justify-between mt-4">
              <button onClick={handleCloseDialog} className="bg-red-500 text-cyan-50 font-bold py-2 px-4 rounded">Close</button>
              <a href={selectedAssignment.document} target='_blank' download className="bg-cyan-600 text-cyan-50 font-bold py-2 px-4 rounded">Download</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
