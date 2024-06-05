import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const UploadNewMaterialForm = () => {
    const navigate = useNavigate();
  const { classId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Image');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !type || !file) {
      alert('Please fill in all fields');
      return;
    }

    // Log formData to console for debugging
    // console.log('Form Data:', name, description, type, file);
    try{
        const accessToken = getCookie('accessToken');
        if (!accessToken) {
            console.error("Access token not found");
            return null;
        }
    
        const response = await axios.post(`${Backend_url}/api/v1/materials/upload-material?classId=${classId}`, {
            name: name,
            description: description,
            type: type,
            file: file
        }, {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
            }
        });
        // console.log(response.data);
        if (response.data && response.data.success) {
            navigate(`/Mentor-Classroom/${classId}/Materials`);
        } else {
            console.error("Error uploading material:", response.data.message);
            navigate(`/Mentor-Classroom/${classId}/Materials`);
        }
    }catch(error){
        console.error("Error uploading material:", error);
        alert('Error uploading material');
    }


    // Reset form fields
    setName('');
    setDescription('');
    setType('Image');
    setFile(null);
  };

  return (
    <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", overflowX: "hidden", marginTop:"50px"}}>
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-cyan-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none"
              id="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Pdf">PDF</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Upload File
            </label>
            <input
              className="appearance-none block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow"
              id="file"
              type="file"
              accept="image/*, video/*, application/pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNewMaterialForm;
