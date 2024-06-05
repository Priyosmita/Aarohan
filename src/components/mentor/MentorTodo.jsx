import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { Backend_url } from "../../../Backend_url";

const MentorTodo = () => {
//   const student = {
//     id: 1,
//     name: "John Doe",
//     todoList: [
//       {
//         id: 1,
//         title: "Complete Math Assignment",
//         description: "Chapter 5 exercises",
//         done: false,
//       },
//       {
//         id: 2,
//         title: "Write Essay",
//         description: "Topic: Importance of Education",
//         done: false,
//       },
//     ],
//   };

const [todos, setTodos] = useState([]);
const navigate = useNavigate();


  const markAsDone = (classId,id) => {
    navigate(`/Mentor-Classroom/${classId}/Submissions/${id}`)
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

  const getTodo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/users/get-todo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.success) {
        const assignments = response.data.data[0].allAssignments.map((assignment) => ({
          _id: assignment._id,
          description: assignment.description,
          deadline: assignment.deadline,
          fullmarks: assignment.fullmarks,
          classname: assignment.classInfo[0].classname,
          classId: assignment.classInfo[0]._id,
      }))
        // console.log(assignments);
        return assignments;
        // const classData = response.data.data;
        // return classData;

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
    const fetchData = async () => {
      const data = await getTodo();
      if (data) {
        setTodos(data);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="container  px-4 py-8"
      style={{
        height: "calc(100vh - 4.3rem)",
        width: "100%",
        display: "flex",
        
        flexDirection: "column",
        alignItems: "center",
        overflowY: "scroll",
        overflowX: "hidden",
        backgroundColor: "#cffafe",
      }}
    >
      <div className="container px-4 py-8 mx-20 justify-center">
        <h1 className="text-3xl font- medium mb-10 text-center text-cyan-950 ">
          Mentor Todo Lists
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2=1 lg:grid-cols-1 gap-6 mx-10  w-11/12 ">
          {todos?.map((task) => (
            <div
              key={task._id}
              className="cursor-pointer 
               bg-cyan-50  hover:scale-105 duration-200 
                 shadow-md rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-cyan-950 mb-2">{task.description}</h2>
                <h2 className="text-cyan-800 text-xl font-medium mb-2">{task.classname}</h2>
                <p className="text-cyan-800 text-lg font-normal">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                <p className="text-cyan-800 font-semibold">Fullmarks: {task.fullmarks}</p>
              </div>

                <button
                  onClick={() => markAsDone(task.classId,task._id)}
                  className="bg-cyan-600 hover:bg-cyan-800 text-white font-bold py-2 px-4 rounded"
                >
                  View
                </button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorTodo;

