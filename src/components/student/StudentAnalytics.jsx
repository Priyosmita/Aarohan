import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import { Backend_url } from "../../../Backend_url";
import { color } from "chart.js/helpers";

const StudentAnalytics = () => {
    const [data, setData] = useState(null);
    const [lineMarks, setLineMarks] = useState([]);
    const [lineWeeks, setLineWeeks] = useState([]);
    const [lineFullMarks, setLineFullMarks] = useState([]);
    const [markedAssignments, setMarkedAssignments] = useState(0);
    const [unmarkedAssignments, setUnmarkedAssignments] = useState(0);
    const [missedAssignments, setMissedAssignments] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

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

    useEffect(() => {
        const getStudentAnalytics = async () => {
            try {
                const accessToken = getCookie('accessToken');
                if (!accessToken) {
                    console.error("Access token not found");
                    return null;
                }

                const response = await axios.get(`${Backend_url}/api/v1/users/get-analytics`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                const studentAnalytics = response.data.data;

                const marks = [];
                const weeks = [];
                const fullMarks = [];
                let count_mark = 0;
                let count_unmark = 0;

                studentAnalytics.assignmentGraph.forEach(performance => {
                    if (performance.marks !== "unmarked") {
                        marks.push(parseInt(performance.marks));
                        const date = new Date(performance.createdAt);
                        const week = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
                        weeks.push(week);
                        fullMarks.push(parseInt(performance.fullMarks));
                        count_mark++;
                    }
                    else {
                        count_unmark++;
                    }
                });

                setMarkedAssignments(count_mark);
                setUnmarkedAssignments(count_unmark);
                setLineMarks(marks);
                setLineWeeks(weeks);
                setLineFullMarks(fullMarks);

                setData({
                    numberOfClasses: studentAnalytics.numberOfClasses,
                    pendingAssignments: studentAnalytics.pendingAssignments,
                    upcomingLiveSessions: studentAnalytics.upcomingLiveSessions,
                    assignmentsAssigned: studentAnalytics.assignmentsAssigned,
                    assignmentsSubmitted: studentAnalytics.assignmentsSubmitted,
                    progressInPath: studentAnalytics.progressInPath,
                });

                setAccuracy(studentAnalytics.accuracy);

            } catch (error) {
                console.error(error);
            }
        };

        getStudentAnalytics();
    }, []);

    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const accuracyChartRef = useRef(null);

    const pieChartInstance = useRef(null);
    const lineChartInstance = useRef(null);
    const accuracyChartInstance = useRef(null);

    useEffect(() => {
        if (data) {
            createPieChart();
            createLineChart();
            createAccuracyChart();
        }

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const handleIntersect = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.id === "pieChart") {
                        createPieChart();
                    } else if (entry.target.id === "lineChart") {
                        createLineChart();
                    } else if (entry.target.id === "accuracyChart") {
                        createAccuracyChart();
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, options);
        if (pieChartRef.current) observer.observe(pieChartRef.current);
        if (lineChartRef.current) observer.observe(lineChartRef.current);
        if (accuracyChartRef.current) observer.observe(accuracyChartRef.current);

        return () => {
            observer.disconnect();
        };
    }, [data]);

    const createPieChart = () => {
        if (pieChartInstance.current !== null) {
            pieChartInstance.current.destroy();
        }

        const ctx = pieChartRef.current.getContext("2d");

        const chartData = {
            labels: ["Marked and Submitted", "Submitted", "Pending"],
            datasets: [
            {
                data: [markedAssignments, data.assignmentsSubmitted - markedAssignments, data.assignmentsAssigned - data.assignmentsSubmitted],
                backgroundColor: ["lightgreen", "#A7C7E7", "#FFD280"],
            },
            ],
        };

        const chartOptions = {
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 30,
                        boxHeight: 30,
                        usePointStyle: true,
                        pointStyle: "circle",
                        font: {
                            size: 20,
                        },
                    },
                },
            },
            layout: {
                margin: {
                    left: 300,
                    right: 300,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
        };

        pieChartInstance.current = new Chart(ctx, {
            type: "pie",
            data: chartData,
            options: chartOptions,
        });
    };

    const createLineChart = () => {
        if (lineChartInstance.current !== null) {
            lineChartInstance.current.destroy();
        }

        const ctx = lineChartRef.current.getContext("2d");

        const chartData = {
            labels: lineWeeks,
            datasets: [
                {
                    label: "Full Marks",
                    data: lineFullMarks,
                    borderColor: "red",
                    tension: 0.4,
                },
                {
                    label: "Obtained Marks",
                    data: lineMarks,
                    borderColor: "blue",
                    tension: 0.4,
                },
            ],
        };

        const chartOptions = {
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10,
                    },
                },
            },
            animation: {
                duration: 2000,
                easing: "easeInOutQuart",
            },
        };

        lineChartRef.current.width = 800;
        lineChartRef.current.height = 400;

        lineChartInstance.current = new Chart(ctx, {
            type: "line",
            data: chartData,
            options: chartOptions,
        });
    };

    const createAccuracyChart = () => {
        if (accuracyChartInstance.current !== null) {
            accuracyChartInstance.current.destroy();
        }
    
        const ctx = accuracyChartRef.current.getContext("2d");
    
        const chartData = {
            labels: ["Accuracy"],
            datasets: [
                {
                    label: ["Accuracy"],
                    data: [100 - accuracy, accuracy],
                    backgroundColor: ['#C0C0C0', '#a3e635'],
                },
                
            ],
        };
    
        const chartOptions = {
            plugins: {
                legend: {
                    display: false,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            
        };
    
        accuracyChartInstance.current = new Chart(ctx, {
            type: "doughnut",
            data: chartData,
            options: chartOptions,
        });
    };
    
    
    
    

    return (
        <div
            style={{
                height: "calc(100vh - 4.3rem)",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflowY: "scroll",
                overflowX: "hidden",
                background: "#cffafe",
                paddingBottom: "50px",
            }}
        >
            {data && (
                <>
                    <h1 className="text-3xl font-normal mt-10 text-center text-cyan-950 ">
                        Student Analytics
                    </h1>
                    <div className="max-w-2xl m-5 p-6 bg-cyan-200 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <HoverEffectBox
                                title="Number of Classes"
                                value={data?.numberOfClasses}
                            />
                            <HoverEffectBox
                                title="Pending Assignments"
                                value={data?.pendingAssignments}
                            />
                            <HoverEffectBox
                                title="No of Upcoming Live Sessions"
                                value={data?.upcomingLiveSessions}
                            />
                            <HoverEffectBox
                                title="Assignments Assigned"
                                value={data?.assignmentsAssigned}
                            />
                            <HoverEffectBox
                                title="Assignments Submitted"
                                value={data?.assignmentsSubmitted}
                            />
                            <HoverEffectBox
                                title="Progress in Path"
                                value={`${data?.progressInPath}%`}
                            />
                        </div>
                    </div>
                </>
            )}
            {data && (
                <div>
                    <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-cyan-950 ">
                        Accuracy
                    </h1>
                    <div
                        className="max-w-2xl mx-auto"
                        style={{ width: "800px", height: "400px", overflowY: "auto" }}
                    >
                        <canvas id="accuracyChart" ref={accuracyChartRef}></canvas>
                    </div>
                </div>
            )}
            {data && (
                <div className="my-12">
                    <h1 className="text-3xl font-bold my-12 text-center text-cyan-950 ">
                        Assignments
                    </h1>
                    <div
                        className="max-w-2xl mx-auto "
                        style={{ width: "800px", height: "600px", overflowY: "auto" }}
                    >
                        <canvas id="pieChart" ref={pieChartRef}></canvas>
                    </div>
                </div>
            )}
            {data && (
                <div>
                    <h1 className="text-3xl font-bold mb-10 mt-10 text-center text-cyan-950 ">
                        Performance
                    </h1>
                    <div
                        className="max-w-2xl mx-auto"
                        style={{ maxHeight: "1000px", overflowY: "auto" }}
                    >
                        <canvas id="lineChart" ref={lineChartRef}></canvas>
                    </div>
                </div>
            )}
            {data && (
                <div className="max-w-2xl m-5 p-6 bg-cyan-400 rounded-lg shadow-lg mt-16">
                    <div className="p-12 bg-cyan-200">
                        <h1 className="text-3xl font-bold text-center text-cyan-950 mb-10">Suggestions For you</h1>
                        {
                            data.progressInPath < 50 ? 
                            <div className="text-lg mt-6 text-red-500">* You have to work hard to improve your Progress in roadmap</div>
                            :
                            <div className="text-lg mt-6 text-green-600">* You are doing well. Keep it up!</div>
                        }
                        {
                            data.pendingAssignments > 0 ? 
                            <div className="text-lg mt-6 text-red-500">* You have pending assignments</div>
                            :
                            <div className="text-lg mt-6 text-green-600">* You have no pending assignments</div>
                        }
                        {
                            data.upcomingLiveSessions > 0 ? 
                            <div className="text-lg mt-6 text-red-500">* You have upcoming live sessions</div>
                            :
                            <div className="text-lg mt-6 text-green-600">* You have no upcoming live sessions</div>
                        }
                        {
                            accuracy < 40 ?
                            <div className="text-lg mt-6 text-red-500">* Your accuracy is low. You have to improve it</div>
                            :
                            accuracy < 70 ?
                            <div className="text-lg mt-6 text-yellow-600">* Your accuracy is average. You have to improve it</div>
                            :
                            <div className="text-lg mt-6 text-green-600">* Your accuracy is good. Keep it up!</div>
                        }
                        { lineFullMarks[lineFullMarks.length - 1]/lineMarks[lineMarks-1]>30 ?
                            <div className="text-lg mt-6 text-red-500">* Your previous performance in assignment was poor !!</div>
                            :
                            lineFullMarks[lineFullMarks.length - 1]/lineMarks[lineMarks-1]>60 ?
                            <div className="text-lg mt-6 text-yellow-600">* Your previous performance in assignment was average !!</div>
                            :
                            <div className="text-lg mt-6 text-green-600">* Your previous performance in assignment was excellent !!</div>

                        }

                    </div>
                </div>
            )}

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

export default StudentAnalytics;

