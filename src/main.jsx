import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import SignUp from './components/auth/Signup';
import LogIn from './components/auth/Login';
import StudentDashboard from './components/student/StudentDashboard';
import { Navigate } from 'react-router-dom';
import MyCourses from './components/student/MyCourses.jsx'
import AskDoubts from './components/student/ConnectToMentor/AskDoubts.jsx'
import StudentTodo from './components/student/StudentTodo.jsx'
import { studentInfoLoader } from './components/student/StudentDashboard.jsx'
import StudentProfile from './components/student/StudentProfile/StudentProfile.jsx'
import FindCourses from './components/student/FindCourses.jsx'
import { studentAllCoursesInfoLoader } from './components/student/FindCourses.jsx'
import { findAllMentors } from './components/student/ConnectToMentor/AskDoubts.jsx'
import { studentMyCoursesInfoLoader } from './components/student/MyCourses.jsx'
import ChatBox from './components/common/chat/ChatBox.jsx'
import MentorDashboard from './components/mentor/MentorDashboard.jsx'

import MyAiRoadmap from './components/student/AiRoadmap/MainRoadmap/MyAiRoadmap.jsx'
import GenerateRoadmap from './components/student/AiRoadmap/GenerateRoadmap/GenerateRoadmap.jsx'

import MyClassrooms from './components/mentor/MyClassrooms.jsx'
import MentorTodo from './components/mentor/MentorTodo.jsx'
import CreateCourse from './components/mentor/CreateCourse.jsx'
import SolveDoubts from './components/mentor/SolveDoubts/SolveDoubts.jsx'
import { MentorInfoLoader } from './components/mentor/MentorDashboard.jsx'
import MentorProfile from './components/mentor/MentorProfile/MentorProfile.jsx'
import { mentorMyCoursesInfoLoader } from './components/mentor/MyClassrooms.jsx'
import { findAllDoubtsStudents } from './components/mentor/SolveDoubts/SolveDoubts.jsx'
import MentorChatBox from './components/common/chat/MentorChatBox.jsx'
import StudentClassroom from './components/student/studentClassroom/StudentClassroom.jsx'
import StudentMaterials from './components/student/studentClassroom/StudentMaterials.jsx'
import StudentAssignments from './components/student/studentClassroom/StudentAssignments.jsx'
import AskDoubtsForClass from './components/student/studentClassroom/AskDoubtsForClass.jsx'
import LiveClassesLink from './components/student/studentClassroom/LiveClassesLink.jsx'

import MentorClassroom from './components/mentor/mentorClassroom/MentorClassroom.jsx'
import MentorMaterials from './components/mentor/mentorClassroom/MentorMaterials.jsx'
import MentorLiveClassesLink from './components/mentor/mentorClassroom/MentorLiveClassesLink.jsx'
import MentorAssignments from './components/mentor/mentorClassroom/MentorAssignment.jsx'
import UploadNewMaterialForm from './components/mentor/mentorClassroom/UploadMaterial.jsx'
import UploadAssignment from './components/mentor/mentorClassroom/CreateAssignment.jsx'
import JoinInvitations from './components/mentor/mentorClassroom/JoinInvitations.jsx'
import Submissions from './components/mentor/mentorClassroom/Submissions.jsx'
import ClassFeedback from './components/student/studentClassroom/ClassFeedback.jsx'
import MentorClassAnalytics from './components/mentor/mentorClassroom/ClassAnalysis.jsx'

import StudentComments from './components/student/studentClassroom/StudentComments.jsx'
import MentorComments from './components/mentor/mentorClassroom/MentorComments.jsx'
import StudentFeedback from './components/mentor/mentorClassroom/StudentFeedback.jsx'
import MaterialFeedback from './components/student/studentClassroom/MaterialFeedback.jsx'
import AssignmentFeedback from './components/student/studentClassroom/AssignmentFeedback.jsx'

import CreateLiveClass from './components/mentor/mentorClassroom/CreateLiveClass.jsx'
import MentorLiveClassRoom from './components/mentor/mentorClassroom/MentorLiveClassRoom.jsx'
import StudentLiveClassRoom from './components/student/studentClassroom/StudentLiveClassRoom.jsx'
import { MentorInfoLoader_1 } from './components/mentor/mentorClassroom/MentorLiveClassRoom.jsx'
import { StudentInfoLoader_1 } from './components/student/studentClassroom/StudentLiveClassRoom.jsx'
import StudentClassAnalytics from './components/student/studentClassroom/ClassAnalysis.jsx'


import StudentAnalytics from './components/student/StudentAnalytics.jsx'
import Quiz from './components/student/Quizpage/QuizPage.jsx'




import LandingPage from './pages/LandingPage.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StudentLiveClassesLink from './components/student/studentClassroom/LiveClassesLink.jsx'



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      {/* Default route */}
      <Route path='/' element={<LandingPage />} />


      {/* <Route path='/' element={<Navigate to="/Login" />} /> */}


      {/* Auth routes */}
      <Route path='/Signup' element={<SignUp />} />
      <Route path='/Login' element={<LogIn />} />


      {/* Student dashboard */}
      <Route path='/' loader={studentInfoLoader} element={<StudentDashboard />}>
        <Route loader={studentMyCoursesInfoLoader} path='/Student-My-Courses' element={<MyCourses />} />
        <Route loader={studentAllCoursesInfoLoader} path='/Student-Find-Courses' element={<FindCourses />} />
        <Route loader={findAllMentors} path='/Student-Ask-Doubt' element={<AskDoubts />} />
        <Route  path='/Student-Analytics' element={<StudentAnalytics />} />
        <Route path='/Student-Todo' element={<StudentTodo />} />
        <Route path='/Student-Roadmap' element={<MyAiRoadmap />} />
        <Route path='/Generate-Roadmap' element={<GenerateRoadmap />} />
        <Route path='/Quiz/:id' element={<Quiz />} />
      </Route>
      {/* Mentor dashboard */}
      <Route loader={MentorInfoLoader} path='/' element={<MentorDashboard />}>
        <Route loader={mentorMyCoursesInfoLoader} path='/Mentor-My-Courses' element={<MyClassrooms />} />
        <Route path='/Create-Courses' element={<CreateCourse />} />
        <Route loader={findAllDoubtsStudents} path='/Mentor-Answer-Doubts' element={<SolveDoubts />} />
        <Route path='/Mentor-Todo' element={<MentorTodo />} />
      </Route>

      {/* Chat */}
      <Route path='/Chat/:id' element={<ChatBox />} />
      <Route path='/MentorChat/:id' element={<MentorChatBox />} />

      {/* Student profile */}
      <Route loader={studentInfoLoader} path='/StudentProfile' element={<StudentProfile />} />
      <Route loader={MentorInfoLoader} path='/MentorProfile' element={<MentorProfile />} />

      {/* Student Classroom */}
      <Route loader={studentInfoLoader} path='/Student-Classroom/:classId' element={<StudentClassroom />}>
        <Route path='Materials' element={<StudentMaterials />} />
        <Route path='Class-Analysis' element={<StudentClassAnalytics />} />
        <Route path='Assignments' element={<StudentAssignments />} />
        <Route path='Ask-Doubts' element={<AskDoubtsForClass />} />
        <Route path='Live-Classes' element={<StudentLiveClassesLink />} />
        <Route path='Feedback' element={<ClassFeedback />} />
        <Route path="Feedback-Material/:materialId" element={<MaterialFeedback />} />
        <Route path="Feedback-Assignment/:assignmentId" element={<AssignmentFeedback />} />
        <Route loader={StudentInfoLoader_1} path='Live-Class/:liveClassId' element={<StudentLiveClassRoom />} />
        <Route path='Comments/:materialId' element={<StudentComments />} />
      </Route>

      {/* Mentor Classroom */}
      <Route loader={MentorInfoLoader} path='/Mentor-Classroom/:classId' element={<MentorClassroom />}>
        <Route path='Materials' element={<MentorMaterials />} />
        <Route path='Assignments' element={<MentorAssignments />} />
        <Route path='Feedback/:studentId' element={<StudentFeedback />} />
        <Route path='Live-Classes' element={<MentorLiveClassesLink />} />
        <Route loader={MentorInfoLoader_1} path='Live-Class/:liveClassId' element={<MentorLiveClassRoom />} />
        <Route path='Create-Live-Class' element={<CreateLiveClass />} />
        <Route path='Upload-Material' element={<UploadNewMaterialForm />} />
        <Route path='Create-Assignment' element={<UploadAssignment />} />
        <Route path='Join-Invitations' element={<JoinInvitations />} />
        <Route path='Submissions/:assignmentId' element={<Submissions />} />
        <Route path='Comments/:materialId' element={<MentorComments />} />
        <Route path='Class-Analysis' element={<MentorClassAnalytics />} />
      </Route>



    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

