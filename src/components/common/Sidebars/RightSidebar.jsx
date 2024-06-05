
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorBox from '../../common/Error';
import { Backend_url } from '../../../../Backend_url';

const RightSidebar = ({ participants, teacherName, isTeacherDashboard, teacherAvatar, classId }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [style, setStyle] = useState('');
  const [error, setError] = useState(false);
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

  const handleCloseError = () => {
    setError(false);
    setStyle('');
  };

  const deleteClass = async () => {
    // Implement the logic to delete the class
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.delete(`${Backend_url}/api/v1/classes/delete?id=${classId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      if (response.data && response.data.success) {
        // Redirect to the dashboard
        navigate('/Mentor-My-Courses');
      }
    }
    catch (error) {
      console.error("Error deleting class:", error);
    }
  }
  const leaveClass = async () => {
    // Implement the logic to leave the class
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.delete(`${Backend_url}/api/v1/classes/leave?id=${classId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      if (response.data && response.data.success) {
        // Redirect to the dashboard
        navigate('/Student-My-Courses');
      }
    }
    catch (error) {
      console.error("Error leaving class:", error);
    }
  };

  const removeStudent = async (studentId) => {
    // Implement the logic to remove the student
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.delete(`${Backend_url}/api/v1/classes/remove-student-from-class?id=${classId}&memberId=${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

      if (response.data && response.data.success) {
        setStyle("bg-green-100 border-green-400 text-green-700");
        setErrorMessage("Participant removed successfully");
        setError(true);
        window.location.reload();
      }
    }
    catch (error) {
      console.error("Error removing student:", error);
      setErrorMessage("Cannot remove participant");
      setError(true);
    }
  }

  const feedbackStudent = async (studentId) => {
    navigate(`/Mentor-Classroom/${classId}/Feedback/${studentId}`);
  };


  return (

    <div className="h-screen w-64 bg-gradient-to-b bg-cyan-50 shadow-lg" style={{ flex: "0 0 300px", marginLeft: "auto" }}>
      {/* Sidebar content */}
      {style === "" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} />)}
      {style !== "" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} style={style} />)}
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-cyan-800 mb-4">Classroom Info</h2>
        <div className="text-cyan-800 mb-4">
          <h3 className="text-xl font-semibold text-cyan-800 mb-3">Participants:</h3>
          <ul className="flex flex-col space-y-2">
            {participants?.map((participant, index) => (
              participant?.role === "student" && (
                <li key={participant?._id} className="flex items-center">
                  <img
                    src={participant?.avatar} // Assuming the avatar URL is provided in the participant object
                    alt={participant?.fullName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>{participant?.fullName}</span>
                  {isTeacherDashboard && <button onClick={()=>removeStudent(participant._id)} className="bg-red-500 text-white px-2 py-1 rounded-md ml-2">Remove</button>}
                  {isTeacherDashboard && <button onClick={()=>feedbackStudent(participant._id)} className="bg-green-500 text-white px-2 py-1 rounded-md ml-2">FeedBack</button>}
                </li>
              )
            ))}
          </ul>
        </div>
        <div className="text-cyan-800 mb-4">
          <h3 className="text-xl font-semibold text-cyan-800 mb-3">Mentor:</h3>
          <div className="flex items-center">
            <img
              src={teacherAvatar} // Assuming the teacher's avatar URL is provided
              alt={teacherName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p>{teacherName}</p>
          </div>
        </div>
        {!isTeacherDashboard && (
          <button
            className="bg-red-300 text-cyan-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-500 hover:text-cyan-50"
            onClick={() => leaveClass()}
          >
            Leave Class
          </button>
        )}
        {isTeacherDashboard && (
          <button
            className="bg-red-300 text-cyan-800 px-4 py-2 rounded-md cursor-pointer hover:bg-red-500 hover:text-cyan-50"
            onClick={() => deleteClass()}
          >
           Delete Class
          </button>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;

