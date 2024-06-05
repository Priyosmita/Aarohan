// Import useState and useEffect if not already imported
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorBox from '../../common/Error';
import { Backend_url } from '../../../../Backend_url';
import { useNavigate } from 'react-router-dom';

const Assignments = ({ onOpenAssignmentClick, onSubmitAssignmentClick }) => {
  const { classId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openedAssignment, setOpenedAssignment] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [style, setStyle] = useState('');
  const [error, setError] = useState(false);
  const [submissionDialog, setSubmissionDialog] = useState(null);
  const [submission, setSubmission] = useState(null);

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

  const getAssignmentsInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/assignments/get-all-assignments?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.data && response.data.success) {
        const materials = response.data.data;
        return materials;
      } else {
        console.error("Error fetching mentors:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      return null;
    }
  };

  const handleCloseError = () => {
    setError(false);
    setStyle('');
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAssignmentsInfo();
      if (data) {
        setAssignments(data);
      }
    };
    fetchData();
  }, [classId]);

  const handleOpenDialog = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitForm(false); // Reset to false when opening assignment
  };

  const handleCloseDialog = () => {
    setSelectedAssignment(null);
    setOpenedAssignment(null);
    setShowSubmitForm(false);
  };

  const handleOpenSubmitForm = (assignment) => {
    setOpenedAssignment(assignment);
    setShowSubmitForm(true);
  };

  const handleCloseSubmitForm = () => {
    setOpenedAssignment(null);
    setShowSubmitForm(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e, assignment) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    // Implement your submission logic here
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
  
      const response = await axios.post(
        `${Backend_url}/api/v1/submissions/submit-assignment?assignmentId=${assignment._id}`,
        {
          description: description,
          document: file
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      // console.log(response.data);
      // alert(response.data.message);
      if (response.data && response.data.success) {
        setStyle("bg-green-100 border-green-400 text-green-700");
        setErrorMessage("Assignment submitted successfully");
        setError(true);
      } else {
        // console.error("Error submitting assignment:", response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("All fields are required");
      }
      else if (error.response?.status === 409) {
        setErrorMessage("You have already submitted this assignment");
      }
      else {
        setErrorMessage("Server error. Please try again later");
      }
      setError(true);
    }
  
    // Reset form fields
    setDescription('');
    setFile(null);
  
    // Close the dialog box
    setOpenedAssignment(null);
    setShowSubmitForm(false);

    
  
    // Call the onSubmitAssignmentClick callback function if needed
  };

  const handleViewSubmission = async(assignment) => {
    try{
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
      const response = await axios.get(`${Backend_url}/api/v1/submissions/view-submission?assignmentId=${assignment._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(response.data.data);
      if (response.data && response.data.success) {
        const submission = response.data.data;
        setSubmission(submission);
      } else {
        console.error("Error fetching submission:", response.data.message);
        return null;
      }
    }
    catch(error){
      console.error("Error fetching submission:", error);
      return null;
    }
    setSubmissionDialog(assignment);
  };

  const closeSubmissionDialouge = () => {
    setSubmissionDialog(null);
    setSubmission(null);
  }

  const feedbackAssignment = (assignment) => {
    navigate(`/Student-Classroom/${classId}/Feedback-Assignment/${assignment._id}`);
  }

  return (
    <div className="w-full "
    style={{height: "calc(100vh - 4.3rem)",
        width: "100%",
        display: "flex",
        
        flexDirection: "column",
        alignItems: "center",
        overflowY: "scroll",
        overflowX: "hidden",
        backgroundColor: "#cffafe",}}>
      {style==="" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} />)}
      {style!=="" && error && (<ErrorBox errorMessages={errorMessage} onClose={handleCloseError} style={style} />)}
      {assignments.map((assignment) => (
        <div key={assignment._id} className="bg-cyan-50 shadow-md rounded-lg p-4 mx-8 my-10  cursor-pointer 
     hover:scale-105 duration-200 
     
    py-2 px-4  hover:text-cyan-50">
          <h1 className="text-xl font-semibold text-cyan-800 ">{assignment.description}</h1>
          <p>Full Marks: {assignment.fullmarks}</p>
          <p className="text-sm text-gray-500 mb-2">Submission Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
          <div className="flex justify-between">
          <div className=" p-2">
            <button onClick={() => handleOpenDialog(assignment)} className="bg-cyan-600 hover:bg-cyan-800 text-white font-bold py-2 px-4 mr-3 rounded focus:outline-none focus:shadow-outline">
              Open Assignment
            </button>
            <button onClick={()=>handleOpenSubmitForm(assignment)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Submit Assignment
            </button>
            </div>
            <div className='flex'>
            <button onClick={()=>feedbackAssignment(assignment)} className="bg-violet-500 hover:bg-violet-700 text-white font-bold mx-3 my-3 py-2 px-2 rounded focus:outline-none focus:shadow-outline">
              Give Feedback
            </button>
            <button onClick={()=>handleViewSubmission(assignment)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-3 my-3 py-2 px-2 rounded focus:outline-none focus:shadow-outline">
              View Submission
            </button>
            </div>
          </div>
        </div>
      ))}
      {selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full bg-cyan-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{selectedAssignment.description}</h2>
            <img src={selectedAssignment.document} alt="Assignment" style={{ width: "auto", height: "400px" }} />
            <div className="flex justify-between mt-4">
              <button onClick={handleCloseDialog} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
              <a href={selectedAssignment.document} target='_blank' download className="bg-cyan-600 text-white font-bold py-2 px-4 rounded">Download</a>
            </div>
          </div>
        </div>
      )}
      {showSubmitForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-cyan-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-cyan-900 mb-2">Submit Assignment</h2>
            <form onSubmit={(e) => handleSubmit(e, openedAssignment)} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block text-cyan-700 text-md font-bold mb-2 " htmlFor="description">
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-cyan-700 text-md font-bold mb-2" htmlFor="file">
                  File
                </label>
                <input
                  type="file"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button onClick={handleCloseSubmitForm} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
                <button type='submit' className="bg-green-500 text-white font-bold py-2 px-4 rounded">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {submissionDialog && submission &&(
        <div className="fixed top-0 left-0 w-full h-full bg-cyan-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Submission Details</h2>
            <p>Description: {submission?.description}</p>
            <p>Submitted on: {new Date(submission?.createdAt).toLocaleString()}</p>
            <p>Marks: {submission?.marks}</p>
            <img src={submission?.document} alt="Submission" style={{ width: "auto", height: "400px" }} />
            {/* Add image div and marks display here */}
            <div className="flex justify-between mt-4">
              <button onClick={() => closeSubmissionDialouge()} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
      {submissionDialog && !submission &&(
        <div className="fixed top-0 left-0 w-full h-full bg-cyan-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-cyan-900 mb-2">Submission Details</h2>
            <p>No submission found</p>
            {/* Add image div and marks display here */}
            <div className="flex justify-between mt-4">
              <button onClick={() => closeSubmissionDialouge()} className="bg-red-500 text-white font-bold py-2 px-4 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
