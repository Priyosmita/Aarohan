import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../../Backend_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const AssignmentFeedback = () => {
    const [understandabilityRating, setUnderstandabilityRating] = useState(0);
    const [usefulnessRating, setUsefulnessRating] = useState(0);
    const [reliabilityRating, setReliabilityRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUnderstandabilityChange = (rating) => {
        setUnderstandabilityRating(rating);
    };

    const handleUsefulnessChange = (rating) => {
        setUsefulnessRating(rating);
    };

    const handleReliabilityChange = (rating) => {
        setReliabilityRating(rating);
    };

    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }

            const response = await axios.post(`${Backend_url}/api/v1/assignments/give-assignment-feedback?assignmentId=${assignmentId}`, {
                understandability:understandabilityRating,
                usefulness:usefulnessRating,
                reliability:reliabilityRating,
                text:feedback
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                setSuccessMessage("Feedback submitted successfully");
                setUnderstandabilityRating(0);
                setUsefulnessRating(0);
                setReliabilityRating(0);
                setFeedback('');
            } else {
                setErrorMessage("Failed to submit feedback");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setErrorMessage("Feedback already submitted for this Assignment");
            } else {
                setErrorMessage("An error occurred. Please try again later.");
            }
        }
    };

    const handleCloseMessage = () => {
        setSuccessMessage('');
        setErrorMessage('');
    };


    return (
        <div className="w-full flex flex-col items-center mt-10">
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 w-10/12 md:w-2/3 lg:w-1/2" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                    <span onClick={handleCloseMessage} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a1 1 0 011.416 1.416L11.416 11l4.348 4.348a1 1 0 01-1.416 1.416L10 12.416l-4.348 4.348a1 1 0 01-1.416-1.416L8.584 11 4.236 6.652a1 1 0 011.416-1.416L10 9.584l4.348-4.348z" /></svg>
                    </span>
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-10/12 md:w-2/3 lg:w-1/2" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                    <span onClick={handleCloseMessage} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a1 1 0 011.416 1.416L11.416 11l4.348 4.348a1 1 0 01-1.416 1.416L10 12.416l-4.348 4.348a1 1 0 01-1.416-1.416L8.584 11 4.236 6.652a1 1 0 011.416-1.416L10 9.584l4.348-4.348z" /></svg>
                    </span>
                </div>
            )}
            <h1 className="text-2xl font-semibold text-cyan-900 mb-4">Give Feedback for Assignment</h1>
            <form onSubmit={handleSubmit} className="bg-cyan-50 p-4 rounded-lg shadow-md w-10/12 md:w-2/3 lg:w-1/2">
                <div className="mb-4">
                    <label className="block text-cyan-700 text-xl font-bold mb-2" htmlFor="understandabilityRating">
                        Understandability Rating
                    </label>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={index < understandabilityRating ? "text-yellow-500" : "text-gray-400"}
                                onClick={() => handleUnderstandabilityChange(index + 1)}
                                style={{ cursor: 'pointer', fontSize: '24px', marginRight: '8px' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-cyan-700 text-xl font-bold mb-2" htmlFor="usefulnessRating">
                        Usefulness Rating
                    </label>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={index < usefulnessRating ? "text-yellow-500" : "text-gray-400"}
                                onClick={() => handleUsefulnessChange(index + 1)}
                                style={{ cursor: 'pointer', fontSize: '24px', marginRight: '8px' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-cyan-700 text-xl font-bold mb-2" htmlFor="reliabilityRating">
                        Reliability Rating
                    </label>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                            <FontAwesomeIcon
                                key={index}
                                icon={faStar}
                                className={index < reliabilityRating ? "text-yellow-500" : "text-gray-400"}
                                onClick={() => handleReliabilityChange(index + 1)}
                                style={{ cursor: 'pointer', fontSize: '24px', marginRight: '8px' }}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-cyan-700 text-xl font-bold mb-2" htmlFor="feedback">
                        Feedback
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline resize-none"
                        id="feedback"
                        placeholder="Enter your feedback here"
                        value={feedback}
                        onChange={handleFeedbackChange}
                        rows="5"
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignmentFeedback;
