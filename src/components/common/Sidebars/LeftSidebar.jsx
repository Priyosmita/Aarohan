import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Backend_url } from "../../../../Backend_url";

const LeftSidebar = ({ menuItems, title, icons, thumbnail }) => {
  const Navigate = useNavigate();

  const logout = async () => {
    try {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
      }
      const response = await axios.post(
        `${Backend_url}/api/v1/users/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      Navigate("/login");
    } catch (error) {
      console.error(error);
    }
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

  return (
    <div
      className="h-screen w-fit bg-gradient-to-b bg-cyan-50 shadow-lg"
      style={{ flex: "0 0 300px" }}
    >
      {/* Sidebar content */}
      <div className="p-6">
        {thumbnail !== undefined && (
          <img src={thumbnail} alt="thumbnail" className="w-full h-40   mb-4" />
        )}
        <h2 className="text-2xl font-semibold text-cyan-900  font-poppins mb-5">
          {title}
        </h2>

        <ul className="font-semibold text-cyan-800 text-xl">
          {menuItems.map((item, index) => (
            <div key={item.name}>
              <li
                className="mb-5 cursor-pointer 
               bg-cyan-50  hover:scale-105 duration-200 
              hover:bg-cyan-100   
               py-2 px-4 rounded-md hover:text-cyan-50"
                onClick={() => Navigate(`/${item.route}`)}
                style={{ color: "inherit" }}
              >
                <FontAwesomeIcon icon={icons[index]} className="mr-3" />
                {item.name}
              </li>
            </div>
          ))}
          <div key="logout"></div>
          <li
            className="mb-5 cursor-pointer text-xl "
            onClick={logout}
            style={{ color: "inherit" }}
          >
            <span className="hover:text-red-700">
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3  " />
              Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
