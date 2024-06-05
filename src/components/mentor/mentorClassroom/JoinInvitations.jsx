import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { Backend_url } from '../../../../Backend_url';

const JoinInvitations = () => {
    const { classId } = useParams();
    const [invitations, setInvitations] = useState([]);

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
        // Fetch join invitations data
        const fetchInvitations = async () => {
            try {
                const accessToken = getCookie('accessToken');
                if (!accessToken) {
                  console.error("Access token not found");
                  return null;
                }
                // Replace the URL with your API endpoint for fetching join invitations
                const response = await axios.get(`${Backend_url}/api/v1/classes/view-all-join-invitations?id=${classId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.data && response.data.success) {
                    const invitations = response.data.data.map(invitation => ({
                        id: invitation._id,
                        member: invitation.member,
                        time: invitation.createdAt,
                        name: invitation.memberInfo.fullName,
                        email: invitation.memberInfo.email,
                        username: invitation.memberInfo.username,
                        avatar: invitation.memberInfo.avatar,
                        institute: invitation.memberInfo.institution,
                        standard: invitation.memberInfo.standard
                    }));
                    // console.log(invitations);
                    setInvitations(invitations);
                } else {
                    console.error("Error fetching join invitations:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching join invitations:", error);
            }
        };

        fetchInvitations();
    }, []);

    const acceptInvitation = async (member) => {
        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.patch(`${Backend_url}/api/v1/classes/accept-join-invitation?id=${classId}`,{
                memberId: member
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error("Error accepting invitation:", response.data.message);
            }

        } catch (error) {
            console.error("Error accepting invitation:", error);
        }
    };

    const rejectInvitation = async (member) => {
        try {
            const accessToken = getCookie('accessToken');
            if (!accessToken) {
                console.error("Access token not found");
                return null;
            }
            const response = await axios.patch(`${Backend_url}/api/v1/classes/reject-join-invitation?id=${classId}`,{
                memberId: member
            } ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data && response.data.success) {
                window.location.reload();
            } else {
                console.error("Error rejecting invitation:", response.data.message);
            }
        } catch (error) {
            console.error("Error rejecting invitation:", error);
        }
    };

    return (
        <div style={{ height: "calc(100vh - 4.3rem)", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", overflowY: "auto", overflowX: "hidden" }}>
        <div className="flex flex-wrap justify-center">
            {invitations.map(invitation => (
                <div key={invitation.id} className="max-w-xs bg-cyan-50 rounded overflow-hidden shadow-lg m-10">
                    <img style={{width:"auto",height:"auto"}} src={invitation.avatar} alt="Student Avatar" />
                    <div className="px-6 py-4">
                        <div className="font-bold text-cyan-950 text-lg mb-2">{invitation.name}</div>
                        <p className="text-cyan-800 text-base mb-2">Institute: {invitation.institute}</p>
                        <p className="text-cyan-800 text-base mb-2">Email: {invitation.email}</p>
                        <p className="text-cyan-800 text-base mb-2">Username: {invitation.username}</p>
                        <p className="text-cyan-800 text-base mb-2">Standard: {invitation.standard}</p>
                        <p className="text-cyan-800 text-base mb-2">Time: {new Date(invitation.time).toLocaleString()}</p>
                    </div>
                    <div className="px-6 py-4 flex justify-between">
                        <button onClick={() => acceptInvitation(invitation.member)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            <FontAwesomeIcon icon={faCheck} className="mr-1" /> Accept
                        </button>
                        <button onClick={() => rejectInvitation(invitation.member)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            <FontAwesomeIcon icon={faTimes} className="mr-1" /> Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </div>
    );
};

export default JoinInvitations;
