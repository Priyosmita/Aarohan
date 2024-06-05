import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../../Backend_url';
//import avatarPlaceholder from '../assets/avatar-placeholder.png'; // Import your avatar placeholder image

const StudentComments = () => {
    const {materialId} = useParams();
    const [comments, setComments] = useState([]);

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

      const getComments = async () => {
        try {
          const accessToken = getCookie('accessToken');
          if (!accessToken) {
            console.error("Access token not found");
            return null;
          }
    
          const response = await axios.get(`${Backend_url}/api/v1/comments/get-all-comments?materialId=${materialId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
    
        // console.log(response.data.data);
    
          if (response.data && response.data.success) {
            const response2 = response.data.data.map(submission => ({
                id: submission._id,
                message: submission.message,
                senderName: submission.sender.fullName,
                senderAvatar: submission.sender.avatar,
                time: submission.createdAt
            }));
            return response2;
          } else {
            console.error("Error fetching submissions:", response.data.message);
            return null;
          }
        } catch (error) {
          console.error("Error fetching submissions:", error);
          return null;
        }
      };
    
      // Fetch submissions data on component mount
      useEffect(() => {
        const fetchData = async () => {
          const data = await getComments();
          if (data) {
            setComments(data);
          }
        };
        fetchData();
      }, [materialId, comments]); 

    const [newComment, setNewComment] = useState('');

    const handleChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        try{
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
              console.error("Access token not found");
              return null;
            }
            const response = axios.post(`${Backend_url}/api/v1/comments/create-comment?materialId=${materialId}`, {
                message: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error("Error adding comment:", response.data.message);
            }
        }
        catch (error) {
            console.error("Error adding comment:", error);
        }
        setNewComment('');
    };

    return (
        <div style={{
            height: "calc(100vh - 4.3rem)",
            width: "100%",
            display: "flex",
            
            flexDirection: "column",
            alignItems: "center",
            overflowY: "scroll",
            overflowX: "hidden",
          }}>
        <div className="container bg-cyan-100 mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Comments</h1>
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                        <img src={comment.senderAvatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                        <div>
                            <h2 className="font-semibold text-cyan-950">{comment.senderName}</h2>
                            <p className="text-cyan-800 text-md">{comment.message}</p>
                            <p className="text-cyan-800 text-xs">{new Date(comment.time).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="mt-8">
                <textarea
                    value={newComment}
                    onChange={handleChange}
                    className="w-full border  bg-cyan-50 rounded-md p-2 focus:outline-none focus:ring focus:border-cyan-500 resize-none"
                    placeholder="Add your comment..."
                    rows="4"
                ></textarea>
                <button type="submit" className="mt-4 bg-cyan-600 text-cyan-50 cursor-pointer  px-4 py-2 rounded-md hover:bg-cyan-800 focus:outline-none focus:ring focus:bg-cyan-600">
                    Add Comment
                </button>
            </form>
        </div>
        </div>
    );
};

export default StudentComments;
