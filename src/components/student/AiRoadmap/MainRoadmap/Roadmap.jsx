import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Backend_url } from "../../../../../Backend_url";

import { PieChart } from "react-minimal-pie-chart";
const Roadmap = ({ events, fetchEvents }) => {
  const navigate = useNavigate();



  return (
    <div>
      <div className="flex flex-col gap-y-3 w-full my-4">
        {events.length > 0 && (<>
          <Circle />

          {events.map((event, key) => {
            return <Fragment key={key}>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto">
                {event.direction === "left" ? (
                  <EventCard
                    heading={event.heading}
                    subHeading={event.subHeading}
                    progress={event.progress}
                    id={event.id}
                    status={event.status}
                    fetchEvents={fetchEvents}
                    topic={event.topic} // Pass the progress prop
                  />
                ) : (
                  <div></div>
                )}

                <Pillar />

                {event.direction === "right" ? (
                  <EventCard
                    heading={event.heading}
                    subHeading={event.subHeading}
                    progress={event.progress}
                    id={event.id}
                    status={event.status}
                    fetchEvents={fetchEvents}
                    topic={event.topic} // Pass the progress prop
                  />
                ) : (
                  <div></div>
                )}


              </div>

              {key !== events.length - 1 && <Circle />}
            </Fragment>
          })}
          <Circle />
        </>)}
        {events.length === 0 && (
          <div className="text-center text-2xl text-cyan-800 font-bold">No Roadmap Found</div>
        )}

      </div>
    </div>
  );
};

const Circle = () => {
  return <div className=" bg-gradient-to-r from-cyan-600 to-cyan-900 rounded-full w-4 h-4  mx-auto"></div>;
};

const Pillar = () => {
  return (
    <div className="bg-gradient-to-b from-cyan-600 to-cyan-900 rounded-t-full rounded-b-full w-2 h-full bg-cyan-600 mx-auto"></div>
  );
};


const EventCard = ({ heading, subHeading, progress, id, status, fetchEvents, topic}) => {
  const navigate = useNavigate();

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

  const markDone = async (id) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      // console.log(accessToken);
      const response = await axios.patch(`${Backend_url}/api/v1/roadmaps/mark-done-roadmap?roadmapId=${id}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 200) {
        fetchEvents();
      }

    } catch (error) {
      fetchEvents()
    }
  }

  const markUndone = async (id) => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      // console.log(accessToken);
      const response = await axios.patch(`${Backend_url}/api/v1/roadmaps/mark-pending-roadmap?roadmapId=${id}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 200) {
        fetchEvents();
      }

    } catch (error) {
      fetchEvents()
    }
  }

  const gotoTest = (id,description,topic) => {
    navigate(`/Quiz/${id}`);
    localStorage.removeItem('description');
    localStorage.removeItem('topic');
    localStorage.setItem('description',description);
    localStorage.setItem('topic',topic);
  }

  return (
    <div className={`transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-col w-96 gap-y-2 border shadow-lg rounded-xl p-4 relative ${status === 'done' ? 'bg-green-200' : 'bg-orange-100'}`}>
      <div className="text-cyan-950 font-bold text-lg mt-6">{heading}</div>
      <div className="text-base text-cyan-800">{subHeading}</div>
      {status === 'pending' && (<div className="text-md text-orange-800">status: {status}</div>)}
      {status === 'done' && (<div className="text-md text-green-800">status: {status}</div>)}
      {progress >= 80 && status !== 'pending' && (<div className="text-sm text-green-500">Suggestion: Excellent Performance Go to Next Step !!</div>)}
      {progress >= 40 && progress < 80 && status !== 'pending' && (<div className="text-sm text-orange-500">Suggestion: Avarage Performance Need more time on it !!</div>)}
      {progress >= 0 && progress< 40 && status !== 'pending' && (<div className="text-sm text-red-500">Suggestion: Poor Performance Do not Jump to the next Step !!</div>)}

      {/* Pie Chart for progress with percentage */}
      <div className="absolute top-4 right-4 w-14 h-14 flex items-center justify-center">
        <div className="relative w-full h-full rounded-full border border-gray-300">
          <PieChart
            data={[
              { title: "Remaining", value: 100 - progress, color: "#E57F84" },
              { title: "Progress", value: progress, color: "green" },
            ]}
            totalValue={100}
            lineWidth={20}
            rounded
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-700">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <button className="bg-red-600 text-cyan-50 font-semibold py-1 px-2 rounded-lg hover:bg-red-700"
          onClick={() => markUndone(id)}
        >
          Mark Undone
        </button>
        <button className="bg-blue-500 text-cyan-50 font-semibold py-1 px-2 rounded-lg hover:bg-blue-800"
        onClick={()=>gotoTest(id,subHeading,topic)}
        >
          Test Now
        </button>
        <button className="bg-green-600 text-cyan-50 font-semibold py-1 px-2 rounded-lg hover:bg-green-700"
          onClick={() => markDone(id)}
        >
          Mark as Done
        </button>
      </div>
    </div>
  );
};




export default Roadmap;
