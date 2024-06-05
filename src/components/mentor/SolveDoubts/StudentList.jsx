import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentList = ({ students }) => {
  const navigate = useNavigate();
  const goToChat = (studentId) => {
    navigate(`/MentorChat/${studentId}`);
  };
  return (
    <div className="shadow-md rounded-lg p-6 w-5/6 cursor-pointer 
    bg-cyan-50  hover:scale-105 duration-200 
   
    py-2 px-4  hover:text-cyan-50">

      <ul>
        {students.map((student) => (
          <li key={student._id} className="flex items-center justify-between py-2 ">
            <div className="h-20 w-20 bg-cyan-100 rounded-full overflow-hidden">
              <img src={student.avatar} alt="student image" className="object-cover w-full h-full" />
            </div>
            <div>
              <span className="text-xl font-medium text-cyan-900">{student.fullName}</span>
              <p className="text-cyan-800 text-lg">{student.email}</p>
            </div>
            <button
              className="bg-cyan-600 hover:bg-cyan-800 text-cyan-50 font-bold py-2 px-4 rounded"
              onClick={()=>goToChat(student._id)}
            >
              Answer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
