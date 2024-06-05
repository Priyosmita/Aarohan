import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom'
import axios from 'axios';
import {Backend_url} from '../../../../Backend_url';

// Chat component
const Chat = ({ message, isYou }) => {
  const time = new Date(message.time);
  const date = time.toLocaleString();
  return (
<div className={`flex ${isYou ? 'justify-end' : 'justify-start'} mb-4`}>
  {!isYou && <img src={message.sendertAvatar} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />}
  <div className={`bg-cyan-100 p-3 rounded-lg w-60 ${isYou ? 'bg-green-300' : 'bg-cyan-200'} max-w-md`}>
    <p className="font-normal  text-cyan-950 ">{message.message}</p>
    <p className="text-sm text-cyan-950 font-medium mt-1 flex justify-end">{isYou ? 'You' : message.senderName}</p>
    <p className="text-xs text-cyan-800 mt-1 flex justify-end">{date}</p>
  </div>
</div>

  );
};

// Chatroom component
const MentorChatBox = () => {
  const { id } = useParams();
  const studentId = id;
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chats, setChats] = useState([]);

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

  const getAllChatsWithMentor = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/chats/get-all-chats-with-student?studentId=${studentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // console.log(response.data);
  
      if (response.data && response.data.success) {
        const chats = response.data.data.map(chat => ({
          _id: chat._id,
          message: chat.message,
          time: chat.createdAt,
          senderName: chat.senderInfo.fullName,
          sendertAvatar: chat.senderInfo.avatar,
          isYou: chat.receiverInfo._id === studentId,
          receiverName: chat.receiverInfo.fullName,
          receiverAvatar: chat.receiverInfo.avatar
        }));
        return chats;
      
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
      const data = await getAllChatsWithMentor();
      if (data) {
        setChats(data);
      }
    };
    fetchData();
  }, []);
  // console.log(chats)

  const handleSendMessage = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      if (inputMessage.trim() !== '') {
        const response = await axios.post(`${Backend_url}/api/v1/chats/chat-with-student?studentId=${studentId}`, {
          message: inputMessage
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        // Handle successful response if needed
        // console.log(response.data);
        const fetchData = async () => {
          const data = await getAllChatsWithMentor();
          if (data) {
            setChats(data);
          }
        };
        fetchData();
        setInputMessage('');
      }
    } catch (error) {
      // Handle error
      console.error('Error sending message:', error);
    }
  };

  const goBackTo = () => {
    navigate("/Mentor-Answer-Doubts");
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b p-4 flex justify-between bg-cyan-100">
        <h1 className="text-xl font-semibold text-cyan-950 cursor-pointer" onClick={goBackTo}>Back</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-4 bg-cyan-50">
        {chats.map((chat, index) => (
          <Chat key={index} message={chat} isYou={chat.isYou} />
        ))}
      </div>
      <div className="border-t p-4 bg-cyan-100">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 mr-2 border rounded focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-cyan-500  hover:bg-cyan-700 text-cyan-50  px-4 py-2 rounded focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorChatBox;
