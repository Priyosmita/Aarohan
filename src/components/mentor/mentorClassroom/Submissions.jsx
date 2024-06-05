import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const Submissions = () => {
  const { classId } = useParams();
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [markingDialogOpen, setMarkingDialogOpen] = useState(false);
  const [marks, setMarks] = useState('');
  const [markingSubmissionId, setMarkingSubmissionId] = useState(null);


  // Function to fetch submissions information
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

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const openSubmissionDialog = (submission) => {
    setSelectedSubmission(submission);
  };

  const closeSubmissionDialog = () => {
    setSelectedSubmission(null);
  };

  const getSubmissionsInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/submissions/view-all-submissions?assignmentId=${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    //   console.log(response.data.data);

      if (response.data && response.data.success) {
        const submissions = response.data.data.map(submission => ({
            id: submission._id,
            assignment: submission.assignment,
            description: submission.description,
            name: submission.owner.fullName,
            username: submission.owner.username,
            marks: submission.marks,
            createdAt: submission.createdAt,
            document: submission.document
            }));
        return submissions;
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
      const data = await getSubmissionsInfo();
      if (data) {
        setSubmissions(data);
      }
    };
    fetchData();
  }, [classId]);


  const openMarkingDialog = (submission) => {
    setMarkingSubmissionId(submission.id);
    setMarkingDialogOpen(true);
  };

  const closeMarkingDialog = () => {
    setMarkingSubmissionId('');
    setMarkingDialogOpen(false);
  };

  const handleMarksChange = (e) => {
    setMarks(e.target.value);
  };

  const markSubmission = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
      const response = await axios.put(`${Backend_url}/api/v1/submissions/mark-submission?submissionId=${markingSubmissionId}`, { marks }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.data && response.data.success) {
        // Close the dialog and refresh submissions
        window.location.reload();
      } else {
        console.error("Error marking submission:", response.data.message);
      }
    } catch (error) {
      console.error("Error marking submission:", error);
    }
  };

  return (
    <>
      <div className='mt-5 flex justify-center'>
        <h1 className="text-2xl font-semibold mb-4">Submissions</h1>
      </div>
      {submissions.map((submission) => (
        <div key={submission.id} className="bg-cyan-200 shadow-md rounded-lg p-4 mx-8 my-8">
          <h1 className="text-xl">{submission.name}</h1>
          <h1 className="text-md">{submission.description}</h1>
          <p className="text-sm text-gray-500 mb-2">Username: {submission.username}</p>
          <p className="text-sm text-gray-500 mb-2">Submission Time: {new Date(submission.createdAt).toLocaleString()}</p>
          <div className="flex justify-between">
            <button onClick={() => openSubmissionDialog(submission)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">View Submission</button>
            {submission.marks === 'unmarked' && (
              <button onClick={()=>openMarkingDialog(submission)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Mark Submission</button>
            )}
          </div>
        </div>
      ))}
      {selectedSubmission && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{selectedSubmission.name}'s Submission</h2>
            <img src={selectedSubmission.document} alt="Submission" style={{ width: "auto", height: "400px" }} />
            <div className="flex justify-between mt-4">
              <button onClick={closeSubmissionDialog} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      {markingDialogOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Mark Submission</h2>
            <label htmlFor="marks" className="block text-gray-700 text-md font-bold mb-2">Marks:</label>
            <input type="text" id="marks" value={marks} onChange={handleMarksChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            <div className="flex justify-between mt-4">
              <button onClick={markSubmission} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Mark</button>
              <button onClick={closeMarkingDialog} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Submissions;