
import React, {useState, useEffect} from 'react';
import ViewClassMaterials from './ViewClassMaterials';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Backend_url } from '../../../../Backend_url';


const StudentMaterials = () => {
  const { classId } = useParams();
  const [materals, setMaterals] = useState([]);
  const handleAskDoubt = () => {
    // Handle Ask Doubt action
  };

  const handleOpenMaterial = () => {
    // Handle Open Material action
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

  const getMaterialsInfo = async () => {
    try {
      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        console.error("Access token not found");
        return null;
      }

      const response = await axios.get(`${Backend_url}/api/v1/materials/get-all-materials?classId=${classId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      // console.log(response.data);
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMaterialsInfo();
      if (data) {
        setMaterals(data);
      }
    };
    fetchData();
  }, [classId])

  const pdf = "../../../assets/pdfs/Format_for_CA2_Assignment_Top_Sheet[1].pdf"
  const video = "../../../assets/videos/Kids Hero Hub _ Learn with Us - Google Chrome 2023-10-17 16-01-09.mp4"

//   const materials = [{
//     id: 1,
//     title: "Your Material Title",
//     description: "Your Material Description",
//     fileType: "PDF",
//     time: "2021-09-01 12:00:00",
//     file:{pdf}
  
//   },
//   {
//     id: 2,
//     title: "Your Material Title",
//     description: "Your Material Description",
//     fileType: "PDF",
//     time: "2021-09-01 12:00:00",
//     file: {pdf}

//   },
//   {
//     id: 3,
//     title: "Your Material Title",
//     description: "Your Material Description",
//     fileType: "Video",
//     time: "2021-09-01 12:00:00",
//     file: {video}
//   },
  
//   {
//     id: 4,
//     title: "Your Material Title",
//     description: "Your Material Description",
//     fileType: "PDF",
//     time: "2021-09-01 12:00:00",
//     file: {pdf}
//   },
//   {
//     id: 5,
//     title: "Your Material Title",
//     description: "Your Material Description",
//     fileType: "PDF",
//     time: "2021-09-01 12:00:00",
//     file: {pdf}
//   },
// ] 

  return (
    <div style={{height: "calc(100vh - 4.3rem)",
    width: "100%",
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    overflowY: "auto",
    overflowX: "hidden",
    background:"#cffafe"
    }}>
      <ViewClassMaterials
        material={materals}
        onAskDoubtClick={handleAskDoubt}
        onOpenMaterialClick={handleOpenMaterial}
        classId={classId}
      />
    </div>
  );
};

export default StudentMaterials;

