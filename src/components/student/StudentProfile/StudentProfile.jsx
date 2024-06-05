import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faBackward } from '@fortawesome/free-solid-svg-icons';
import { useLoaderData } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import FormData from 'form-data';
import axios from 'axios';
import { Backend_url } from '../../../../Backend_url';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(new FormData());
  const [showDialog, setShowDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const data = useLoaderData()
  // console.log(data)

  const [avatar,setAvatar] = useState()
  const [name,setName] = useState()
  const [username,setUsername] = useState()
  const [email,setEmail] = useState()
  const [address,setAddress] = useState()
  const [phone,setPhone] = useState()
  const [dob,setDob] = useState()
  const [language,setLanguage] = useState()
  const [institution,setInstitution] = useState()
  const [standard,setStandard] = useState()
  const [image,setImage] = useState()

  useEffect(() => {
    setAvatar(data.data.avatar)
    setName(data.data.fullName)
    setUsername(data.data.username)
    setEmail(data.data.email)
    setAddress(data.data.address)
    setPhone(data.data.contactNo)
    setDob(data.data.DOB.slice(0,10))
    setLanguage(data.data.language)
    setInstitution(data.data.institution)
    setStandard(data.data.standard)
  }, [data.data.avatar,data.data.fullName,data.data.username,data.data.email,data.data.address,data.data.contactNo,data.data.DOB,data.data.language,data.data.institution,data.data.standard])

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }
  
      // const formData = new FormData();
      // formData.append('avatar', selectedImage); // Append the selected image to FormData
      // console.log("Form Data:", formData);
      // console.log("Selected Image:", selectedImage);
      const response = await axios.patch(`${Backend_url}/api/v1/users/avatar`, {
        avatar: image
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        }
      });
      // console.log("Response:", response);
      setShowDialog(false)
      navigate('/StudentProfile');
    } catch (error) {
      console.error("Error:", error);
    }
  }
  

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

  
  const handlePasswordChange = () => {
    // Handle password change logic here
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm New Password:", confirmNewPassword);
    // Reset fields after handling password change
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowPasswordDialog(false);
  };

  return (
    <div className="min-h-screen bg-cyan-50 py-6 flex flex-col justify-center sm:py-12 ">
      <div className="absolute top-4 left-4">
      
        <button onClick={() => navigate('/Student-My-Courses')} className="text-xl text-cyan-600 hover:text-cyan-800">
        <FontAwesomeIcon icon={faBackward} style={{marginRight:"5px"}} />
          Back
        </button>
      </div>
      <div className="relative py-2 mx-auto  w-4/6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-cyan-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl "></div>
        <div className="relative px-4 py-10 bg-cyan-50 shadow-lg sm:rounded-3xl  ">
          <div className="max-w-md mx-auto">
            <div>
              <img
                src={avatar}
                alt="Profile Picture"
                className=" w-40 h-40 mx-auto rounded-full"
              />
              <button
                onClick={() => setShowDialog(true)}
                className="block text-center mx-auto mt-2 text-xl  text-cyan-800 hover:underline"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
            <div className="text-center mt-4">
              <h1 className="text-3xl font-semibold text-cyan-800">
                {/* Fullname */}
                {name}
              </h1>
              <p className="mt-2 text-sm text-cyan-800">
                {/* Username */}
                {username}
              </p>
            </div>
            <div className="mt-6">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Email
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {email}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Address
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {address}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Phone
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {phone}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Date Of Birth
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {dob}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Language
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {language}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Institution
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {institution}
                  </dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="text-xl font-medium text-cyan-800">
                    Standard
                  </dt>
                  <dd className="mt-1 text-m text-cyan-900">
                    {standard}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-14 text-center">
              <button
                onClick={() => setShowPasswordDialog(true)}
                className="bg-cyan-500 hover:bg-cyan-700 text-cyan-50 font-bold py-2 px-4 
                rounded mx-6"
              >
                Change Password
              </button>
              <button              
                className="bg-cyan-500 hover:bg-cyan-700 text-cyan-50 font-bold py-2 px-4 rounded"
              >
                Edit Profile Info
              </button>
            </div>
            
          </div>
        </div>
      </div>
      {showDialog && (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-cyan-600 opacity-75"></div>
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-cyan-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form onSubmit={handleFormSubmit} >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-cyan-900" id="modal-title">
                  Change Profile Image
                </h3>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {selectedImage && (
                    <img src={selectedImage} alt="Preview" className="mt-2 max-h-40" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => setShowDialog(false)}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

      {showPasswordDialog && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Change Password
                    </h3>
                    <div className="mt-2">
                      <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-2 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="mt-2 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handlePasswordChange}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowPasswordDialog(false)}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
