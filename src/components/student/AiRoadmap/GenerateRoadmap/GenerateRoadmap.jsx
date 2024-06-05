import React, { useState } from 'react';
import { faRobot, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backend_url } from '../../../../../Backend_url';
import ErrorBox from '../../../common/Error';
import axios from 'axios';
import { set } from 'lodash';

function GenerateRoadmap() {
  const [roadmap, setRoadmap] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(''); // [roadmap1, roadmap2, roadmap3, ...
  const [deadline, setDeadline] = useState("");
  const [allRoadmaps, setAllRoadmaps] = useState([]); // [roadmap1, roadmap2, roadmap3, ...
  const [hoursPerWeek, setHoursPerWeek] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState('');
  const [style  , setStyle] = useState('');






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


  const setAsRoadmap = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      const response = await axios.post(`${Backend_url}/api/v1/roadmaps/create-roadmap`, {
        roadmap: allRoadmaps,
        subject: selectedSubject
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(response.data);
      setDescription('Roadmap has been saved successfully');
      setStyle('bg-green-200');
      setError(true);
    } catch (error) {
      console.error(error);
      setDescription('Error in saving the roadmap');
      setStyle('bg-red-200');
      setError(true);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.post(`${Backend_url}/api/v1/roadmaps/generate-roadmap`, {
        text: courseName,
        hour: parseInt(hoursPerWeek),
        deadline: parseInt(deadline)
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const generatedRoadmaps = response.data.data.roadmap;
      setAllRoadmaps(generatedRoadmaps)
      setSelectedSubject(courseName)

      const steps = [];

      generatedRoadmaps.forEach((step, index) => {
        steps.push({ step: index + 1, description: step });
      });
      setRoadmap(steps);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
    }

  };

  const handleCloseError = () => {
    setError(false);
    setStyle("");
  };

  return (
    <div className="flex bg-cyan-100 flex-col items-center h-screen">
      <div className="w-full p-6">
        <h1 className='text-3xl font-semibold mb-5 text-center border-b-current text-cyan-900'>Generate Roadmap</h1>
        <form onSubmit={handleSubmit} className="flex space-x-4 justify-center">
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-1/3 h-12 bg-cyan-50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Course Name"
            required
          />
          <select
            className="w-1/3 h-12 bg-cyan-50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 "
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}          >
            <option value="" disabled  selected className='text-gray-400' >Select the Deadline</option>
            <option value="2">2 Weeks</option>
            <option value="4">4 Weeks</option>
            <option value="6">6 Weeks</option>
            <option value="8">8 Weeks</option>
            <option value="10">10 Weeks</option>
            <option value="12">12 Weeks</option>
          </select>
          <input
            type="number"
            max={10}
            min={1}
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="w-1/3 h-12 bg-cyan-50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Hours per Week"
            required
          />
          <button className='p-1 rounded-xl cursor-pointer hover:scale-105 duration-200 shadow-xl bg-gradient-to-br from-pink-400 to-pink-800 text-cyan-50 font-semibold'>
            <FontAwesomeIcon icon={faRobot} /> Generate
          </button>
        </form>
      </div>
      
      <div style={{ overflowY: "scroll", width: "100%", padding: "70px 0px 70px 0px" }}>
      
      {error && (
        <div className='w-8/12 mx-auto mb-4'>
        <ErrorBox
          errorMessages={description}
          onClose={handleCloseError}
          style={style}
        />
        </div>
      )}
      
        <table className="mb-10 w-3/4 mx-auto border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr>
              <th className="border shadow-lg bg-cyan-700 text-cyan-50 p-2">Step</th>
              <th className="border shadow-lg bg-cyan-700 text-cyan-50 p-2">Description</th>
            </tr>
          </thead>
          {loading && (<div className='my-8 items-center justify-center mx-auto'>
            <div role="status" className='flex justify-center'>
              <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>)}
          {loading === false && (

            <tbody>
              {roadmap.map((step, index) => (
                <tr key={index}>
                  <td className="border shadow-lg bg-cyan-50 text-cyan-900 p-2">{step.step}</td>
                  <td className="border shadow-lg bg-cyan-50 text-cyan-900 p-2">{step.description}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        
      </div>
      {roadmap.length > 0 && (
        <div className="fixed bottom-5 right-10">
          <button className='p-3 rounded-xl cursor-pointer hover:scale-105 duration-200 shadow-xl bg-gradient-to-br from-green-400 to-green-800 text-cyan-50 font-semibold'
          onClick={setAsRoadmap} >
            <FontAwesomeIcon icon={faCheckCircle} /> Save Roadmap
          </button>
        </div>
      )}
    </div>
  );
}

export default GenerateRoadmap;
