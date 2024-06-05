import React from "react";
import { useNavigate } from "react-router-dom";

const MentorList = ({ mentors }) => {
  const navigate = useNavigate();
  const goToChat = (mentorId) => {
    // alert(`Chat with mentor : ${mentorId}`);
    navigate(`/Chat/${mentorId}`);
  };
  return (
    <div
      className=" shadow-md rounded-lg p-6 w-5/6 cursor-pointer 
    bg-cyan-50  hover:scale-105 duration-200 
   
    py-2 px-4  hover:text-cyan-50"
    >
      <ul className="">
        {mentors.map((mentor) => (
          <li
            key={mentor._id}
            className="flex items-center justify-between py-2 "
          >
            <div className="h-20 w-20  rounded-full overflow-hidden">
              <img
                src={mentor.avatar}
                alt="mentor image"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <span className="text-xl font-medium text-cyan-800">
                {mentor.fullName}
              </span>
              <p className="text-slate-600 text-lg">{mentor.email}</p>
            </div>
            <button
              className="bg-cyan-700 hover:bg-cyan-500 text-cyan-50 font-bold py-2 px-4 rounded"
              onClick={() => goToChat(mentor._id)}
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentorList;
