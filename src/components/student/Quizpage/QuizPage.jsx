import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Backend_url } from "../../../../Backend_url";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const [selectedOptions, setSelectedOptions] = useState({});
    const description = localStorage.getItem('description');
    const topic = localStorage.getItem('topic');
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const handleOptionChange = (questionIndex, option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [questionIndex]: option
        }));
    };

    const getCookie = (name) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split("; ");
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    };

    const getQuestions = async () => {
        try {
            setLoading(true);
            const accessToken = getCookie("accessToken");
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }

            const response = await axios.post(`${Backend_url}/api/v1/roadmaps/generate-questions?roadmapId=${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!Array.isArray(response.data.data.questions)) {
                if (response.data.data.questions.questions === undefined) {
                    setQuestions(response.data.data.questions.mcq_questions);
                } else {
                    setQuestions(response.data.data.questions.questions);
                }
            } else {
                setQuestions(response.data.data.questions);
            }
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getQuestions();
    }, []); // Empty dependency array ensures this runs only once after the initial render

    const handleSubmit = async (event) => {
        event.preventDefault();
        let correctAnswersCount = 0;

        questions.forEach((question, index) => {
            if (selectedOptions[index] === question.correct_option) {
                correctAnswersCount++;
            }
        });

        try {
            const accessToken = getCookie("accessToken");
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            alert(`You got ${correctAnswersCount} correct answers out of ${questions.length}`);
            const response = await axios.patch(`${Backend_url}/api/v1/roadmaps/update-marks-roadmap?roadmapId=${id}&marks=${correctAnswersCount}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            localStorage.removeItem('description');
            localStorage.removeItem('topic');
            navigate(`/Student-Roadmap`);
        } catch (error) {
            console.log(error);
            localStorage.removeItem('description');
            localStorage.removeItem('topic');
            navigate(`/Student-Roadmap`);
        }
    };

    return (
        <div style={{ background: "#cffafe", padding: "20px", borderRadius: "10px", height: "calc(100vh - 4.3rem)", overflowY: "auto" }}>
            <h1 className="text-3xl font-normal mb-10 mt-10 text-center text-cyan-950">
                Quiz [{topic}]
            </h1>
            <div className="max-w-2xl mx-auto m-5 p-6 bg-cyan-200 rounded-lg shadow-lg">
               {loading===false && ( <form onSubmit={handleSubmit}>
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="mb-10">
                            <h2 className="text-xl mb-4 text-cyan-950">Question {qIndex + 1} :</h2>
                            <h2 className="text-xl mb-4 text-cyan-950">{q.question}</h2>
                            {q.options.map((option, oIndex) => (
                                <div key={oIndex} className="mb-2 text-xl">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            value={option}
                                            checked={selectedOptions[qIndex] === option}
                                            onChange={() => handleOptionChange(qIndex, option)}
                                            className="mr-2"
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="mt-10 p-2 bg-cyan-500 text-white rounded block mx-auto"
                    >
                        Submit
                    </button>
                </form>)}

                {loading===true && (
                    <div className="text-2xl text-center text-cyan-950">Loading...</div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
