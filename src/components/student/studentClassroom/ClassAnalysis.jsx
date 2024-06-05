import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2"; // Import Bar component
import axios from "axios";
import { useParams } from "react-router-dom";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Backend_url } from "../../../../Backend_url";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const StudentClassAnalytics = () => {
    const { classId } = useParams();

    const [classNegativeFeedback, setClassNegativeFeedback] = useState(null);
    const [classPositiveFeedback, setClassPositiveFeedback] = useState(null);
    const [assignmentFeedbackEmotions, setAssignmentFeedbackEmotions] = useState([]);
    const [materialFeedbackEmotions, setMaterialFeedbackEmotions] = useState([]);
    const [assignmentScores, setAssignmentScores] = useState([]);
    const [materialScores, setMaterialScores] = useState([]);
    const [materialCount, setMaterialCount] = useState(0);
    const [assignmentCount, setAssignmentCount] = useState(0);
    const [membersCount, setMembersCount] = useState(0);

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

    useEffect(() => {
        const getStudentAnalytics = async () => {
            try {
                const accessToken = getCookie("accessToken");
                if (!accessToken) {
                    console.error("Access token not found");
                    return null;
                }

                const response = await axios.get(`${Backend_url}/api/v1/classes/get-class-analytics?classId=${classId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const classFeedbacks = response.data.data.classFeedbacks;
                const classPositiveFeedbacks = classFeedbacks.filter(
                    (feedback) => feedback.emotion === "POSITIVE"
                );
                setClassPositiveFeedback(classPositiveFeedbacks[0].count);
                const classNegativeFeedbacks = classFeedbacks.filter(
                    (feedback) => feedback.emotion === "NEGATIVE"
                );
                setClassNegativeFeedback(classNegativeFeedbacks[0].count);
                setAssignmentFeedbackEmotions(response.data.data.assignmentFeedbacksEmotions);
                setMaterialFeedbackEmotions(response.data.data.materialFeedbacksEmotions);
                setAssignmentScores(response.data.data.assignmentStarsCount);
                setMaterialScores(response.data.data.materialStarsCount);
                setMaterialCount(response.data.data.totalMaterials);
                setAssignmentCount(response.data.data.totalAssignments);
                setMembersCount(response.data.data.totalStudents);
            } catch (error) {
                console.error(error);
            }
        };

        getStudentAnalytics();
    }, []);

    const pieOptions = {
        plugins: {
            datalabels: {
                color: '#fff',
                display: true,
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    const total = context.chart._metasets[0].total;
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${percentage}%`;
                }
            }
        }
    };

    // Bar chart options
    const barOptions = {
        plugins: {
            datalabels: {
                display: true // Enable data labels for bar charts
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="" style={{ height: "830px", overflowY: "auto" , textAlign:"center"}}>
                    <h1 className="text-3xl font-bold  mt-10 text-center text-cyan-950">
                        Class Analytics
                    </h1>
                    <div className="max-w-2xl m-5 mt-12 p-6 bg-cyan-200 rounded-lg shadow-lg mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            <HoverEffectBox
                                title="Total Materials"
                                value={materialCount}
                            />
                            <HoverEffectBox
                                title="Total Assignments"
                                value={assignmentCount}
                            />
                            <HoverEffectBox
                                title="Students Count"
                                value={membersCount}
                            />
                        </div>
                    </div>
            <div style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8">
                <h2 className="mb-8 text-2xl font-bold">Class Feedback</h2>
                {classPositiveFeedback !== null && classNegativeFeedback !== null && (
                    <Pie data={{
                        datasets: [{
                            data: [classPositiveFeedback, classNegativeFeedback],
                            backgroundColor: ["#3572EF","#F67280"], // Green and orange
                        }],
                        labels: ["Positive Feedback", "Negative Feedback"],
                    }} options={pieOptions} />
                )}
            </div>
            <div className="text-center my-12">
                <h1 className="text-2xl font-bold">Material Feedback</h1>
                {materialFeedbackEmotions.map((material, index) => (
                    <div key={index} style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-12">
                        <h2 className="mb-8 text-xl font-mono">{material.description}</h2>
                        {material.positiveFeedbackCount !== 0 || material.negativeFeedbackCount !== 0 ? (
                            <Pie data={{
                                datasets: [{
                                    data: [material.positiveFeedbackCount, material.negativeFeedbackCount],
                                    backgroundColor: ["#3572EF","#F67280"], // Green and orange
                                    hoverBackgroundColor: ["#3572EF","#F67280"],
                                }],
                                labels: ["Positive Feedback", "Negative Feedback"],
                            }} options={pieOptions} />
                        ) : (
                            <p>No Feedback found</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="text-center my-12">
                <h1 className="text-2xl font-bold">Material Scores</h1>
                {materialScores.map((material) => (
                    <div key={material.description} style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8">
                        <h2 className="mb-8 text-xl font-mono">{material.description}</h2>
                        {material.totalFeedbackCount > 0 && (
                            <Bar
                                data={{
                                    labels: ['Reliability', 'Understandability', 'Usefulness'],
                                    datasets: [
                                        {
                                            label: 'Total Stars',
                                            data: [material.totalReliabilityStars, material.totalUnderstandabilityStars, material.totalUsefulnessStars],
                                            backgroundColor: ["#3572EF"], // Green
                                            borderColor: ["#3572EF"],
                                            borderWidth: 1,
                                        },
                                        {
                                            label: 'Full Stars',
                                            data: [material.fullReliabilityStars, material.fullUnderstandabilityStars, material.fullUsefulnessStars],
                                            backgroundColor: "#F67280", // Orange
                                            borderColor: "#F67280",
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={barOptions}
                            />
                        )}
                        {material.totalFeedbackCount === 0 && <p>No feedback found</p>}
                    </div>
                ))}
            </div>
            <div className="text-center my-12">
                <h1 className="text-2xl font-bold">Assignment Feedback</h1>
                {assignmentFeedbackEmotions.map((assignment, index) => (
                    <div key={index} style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8">
                        <h2 className="mb-8 text-xl font-mono">{assignment.description}</h2>
                        {assignment.positiveFeedbackCount !== 0 || assignment.negativeFeedbackCount !== 0 ? (
                            <Pie data={{
                                datasets: [{
                                    data: [assignment.positiveFeedbackCount, assignment.negativeFeedbackCount],
                                    backgroundColor: ["#3572EF","#F67280"], // Green and orange
                                    hoverBackgroundColor: ["#3572EF","#F67280"],
                                }],
                                labels: ["Positive Feedback", "Negative Feedback"],
                            }} options={pieOptions} />
                        ) : (
                            <p className="text-sm">No Feedback found</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="text-center my-12">
                <h1 className="text-2xl font-bold">Assignment Scores</h1>
                {assignmentScores.map((assignment) => (
                    <div key={assignment.description} style={{ width: "50%", margin: "auto", textAlign: "center" }} className="pt-8">
                        <h2 className="mb-8 text-xl font-mono">{assignment.description}</h2>
                        {assignment.totalFeedbackCount > 0 && (
                            <Bar
                                data={{
                                    labels: ['Reliability', 'Understandability', 'Usefulness'],
                                    datasets: [
                                        {
                                            label: 'Total Stars',
                                            data: [assignment.totalReliabilityStars, assignment.totalUnderstandabilityStars, assignment.totalUsefulnessStars],
                                            backgroundColor: "#3572EF", // Green
                                            borderColor: "#3572EF",
                                            borderWidth: 1,
                                        },
                                        {
                                            label: 'Full Stars',
                                            data: [assignment.fullReliabilityStars, assignment.fullUnderstandabilityStars, assignment.fullUsefulnessStars],
                                            backgroundColor: "#F67280", // Orange
                                            borderColor: "#F67280",
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                                options={barOptions}
                            />
                        )}
                        {assignment.totalFeedbackCount === 0 && <p>No feedback found</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const HoverEffectBox = ({ title, value }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="p-4 bg-cyan-400 border border-gray-300 rounded-lg text-center shadow-sm flex flex-col justify-center items-center h-36 transition-transform duration-300 transform hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
    );
};

export default StudentClassAnalytics;
