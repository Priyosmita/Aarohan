import React, { useState, useEffect } from 'react';
import Roadmap from './Roadmap';
import { faTrash, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backend_url } from '../../../../../Backend_url';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyAiRoadmap() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [topic, setTopic] = useState('')

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

    const fetchEvents = async () => {
        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.get(`${Backend_url}/api/v1/roadmaps/get-roadmap`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const createdEvents = []
            setTopic(response.data.data.roadmap[0].topic);
            response.data.data.roadmap.map((event, index) => {
                createdEvents.push({
                    heading: `Step ${index + 1}`,
                    subHeading: event.description,
                    direction: index % 2 === 0 ? "right" : "left",
                    id: event._id,
                    status: event.status,
                    progress: parseInt(event.marks) / parseInt(event.fullMarks) * 100,
                    topic: event.topic
                });
            })
            // console.log(createdEvents);
            setEvents(createdEvents);
        } catch (error) {
            console.error(error);
        }

    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const gotoAiGeneration = () => {
        navigate('/Generate-Roadmap');
    }

    const deleteRoadmap = async () => {
        try {
            const accessToken = getCookie("accessToken");
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.delete(`${Backend_url}/api/v1/roadmaps/delete-roadmap`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            if (response.status === 200) {
                fetchEvents();
            }
            navigate('/Student-Roadmap')
        } catch (error) {
            console.error(error);
            fetchEvents();
        }
    }

    return (
        <div style={{
            height: "calc(100vh - 4.3rem)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowX: "hidden",
            background: "#cffafe",
            padding: "30px 0px 70px 0px",
            position: "relative"
        }}>
            <h1 className='text-3xl font-semibold  mb-5 text-center border-b-current  text-cyan-900'>My Roadmap {topic && `[${topic}]`}</h1>
            <div style={{ overflowY: "scroll", width: "100%", padding: "70px 0px 70px 0px" }}>
                <Roadmap events={events} fetchEvents={fetchEvents} />
            </div>
            <div className='fixed bottom-5 left-80'>
                <button className='p-3 rounded-xl cursor-pointer hover:scale-105 duration-200 shadow-xl bg-red-600 text-cyan-50 font-semibold'
                    onClick={() => deleteRoadmap()}
                >
                    <FontAwesomeIcon icon={faTrash} /> Delete Roadmap
                </button>
            </div>
            <div className='fixed bottom-5 right-10'>
                <button className='p-3 rounded-xl cursor-pointer hover:scale-105 duration-200 shadow-xl bg-gradient-to-br from-pink-400 to-pink-800 text-cyan-50 font-semibold'
                    onClick={() => { gotoAiGeneration() }}
                >
                    <FontAwesomeIcon icon={faRobot} /> Generate AI Roadmap
                </button>
            </div>
        </div>
    );
}

export default MyAiRoadmap;
