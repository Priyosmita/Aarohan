import express from "express"
import cors from "cors"


const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))


// Server Status
import serverStatusRouter from "./src/routes/serverStatus.routes.js"
app.use("/",serverStatusRouter);

// User Endpoints
import userRouter from './src/routes/user.routes.js'
app.use("/api/v1/users", userRouter)

// Class Endpoints
import classRouter from './src/routes/class.routes.js'
app.use("/api/v1/classes", classRouter)

// Chat Endpoints
import chatRouter from './src/routes/chat.routes.js'
app.use("/api/v1/chats", chatRouter)

// Material Endpoints
import materialRouter from './src/routes/material.routes.js'
app.use("/api/v1/materials", materialRouter)

// Assignment Endpoints
import assignmentRouter from './src/routes/assignment.routes.js'
app.use("/api/v1/assignments", assignmentRouter)

// Submission Endpoints
import submissionRouter from './src/routes/submission.routes.js'
app.use("/api/v1/submissions", submissionRouter)

// Comment Endpoints
import commentRouter from './src/routes/comment.routes.js'
app.use("/api/v1/comments", commentRouter)

// Live Class Endpoints
import liveClassRouter from './src/routes/liveClasses.routes.js'
app.use("/api/v1/live-classes", liveClassRouter)


// Roadmap Endpoints
import roadmapRouter from './src/routes/roadmap.routes.js'
app.use("/api/v1/roadmaps", roadmapRouter)

export { app }