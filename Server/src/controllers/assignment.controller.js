import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {Class} from "../models/class.model.js"
import { Assignment } from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Submission } from "../models/submissions.model.js";
import { Feedback } from "../models/feedback.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ClassMember } from "../models/classMember.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios"

dotenv.config({
    path: './.env'
})




const createAssignment = asyncHandler( async (req, res) => {
    const classId = req.query.classId
    const userId = req.user._id

    const current_user = await User.findById(userId)
    const current_class= await Class.findById(classId)
    if (current_class.owner.toString() !== current_user._id.toString()) {
 
        throw new ApiError(400, "You are not owner of this class")
    }

    const {description,deadline,fullmarks} = req.body
    if (
        [userId, deadline, classId, description,fullmarks].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const documentLocalPath = req.files?.file[0]?.path;

    if (!documentLocalPath) {
        throw new ApiError(400, " file is required")
    }

    const doc = await uploadOnCloudinary(documentLocalPath)
    if (!doc) {
        throw new ApiError(400, " file is required")
    }
   
    const deadlineDate = new Date(deadline)
    const myAssignemnt = await Assignment.create({
        class: classId,
        document: doc.url,
        deadline:deadlineDate, 
        description:description,
        owner: current_user._id,
        fullmarks:fullmarks,
    })

    const createdAssignment = await Assignment.findById(myAssignemnt._id)

    if (!createdAssignment) {
        throw new ApiError(500, "Something went wrong while creating the class")
    }

    return res.status(201).json(
        new ApiResponse(200, {user: current_user,
            createdAssignment:createdAssignment,
        }, "Assignment Added Successfully")
    )
})


const deleteAssignment = asyncHandler( async (req, res) => {
    const classId = req.query.classId
    const assignmentId = req.query.assignmentId
    const userId = req.user._id

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
        throw new ApiError(400, "Assignment not found")
    }

    const classMember = await ClassMember.findOne({
        member: userId,
        class: classId,
        role: "mentor",
        status: "accepted"
    })

    if (!classMember) {
        throw new ApiError(400, "You are not mentor of this class")
    }

    await Assignment.findByIdAndDelete(assignmentId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Assignment Deleted Successfully")
    )
})


const getAllAssignment = asyncHandler( async (req, res) => {
    const classId = req.query.classId
    const userId = req.user._id


    const current_class= await Class.findById(classId)
    const current_user = await User.findById(userId)
    if (current_class.owner.toString() !== current_user._id.toString()) {
        const classMember = await ClassMember.findOne({
            member: userId,
            class: classId,
            status: "accepted"
        })


        if (!classMember) {
            throw new ApiError(400, "You are not member of this class")
        }
    }

    const assignments = await Assignment.aggregate([
        {
              "$match": {
                  "class": current_class._id
              }
          },
          {
              "$sort": {
                  "createdAt": 1
              }
          },
          {
              "$lookup": {
                  "from": "submissions",
                  "let": { "assignmentId": "$_id" },
                  "pipeline": [
                      {
                          "$match": {
                              "$expr": { "$and": [
                                  { "$eq": ["$assignment", "$$assignmentId"] },
                                  { "$eq": ["$owner", current_user._id] }
                              ]}
                          }
                      }
                  ],
                  "as": "submissions"
              }
          },
          {
              "$addFields": {
                  "marks": {
                      "$ifNull": [{ "$arrayElemAt": ["$submissions.marks", 0] }, null]
                  }
              }
          }
      ])

    return res.status(200).json(
        new ApiResponse(200,  assignments, "Assignments Fetched Successfully")
    )
})

const giveAssignmentFeedback = asyncHandler( async (req, res) => {
    const assignmentId = req.query.assignmentId
    const userId = req.user._id

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
        throw new ApiError(400, "Assignment not found")
    }

    const isClassMember = await ClassMember.findOne({
        member: userId,
        class: assignment.class,
        status: "accepted"
    })

    if (!isClassMember) {
        throw new ApiError(400, "You are not member of this class")
    }

    const {understandability, usefulness, reliability,text} = req.body
    

    if (
        [understandability, usefulness, reliability,text].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const isFeefbackGiven = await Feedback.findOne({
        provider: userId,
        type: "assignment",
        forAssignment: assignmentId
    })

    if (isFeefbackGiven) {
        throw new ApiError(409, "Feedback already given")
    }

    //TODO: emotion calculation
    let emotion;
    try{
        const response = await axios.post(`${process.env.SENTIMENT_ANALYSIS_API}/sentiment?text=${text}`)
        emotion = response.data.emotion
    }catch(err){
        throw new ApiError(400, "Sentiment Analysis API is not working")
    }

    const feedback = await Feedback.create({
        provider: userId,
        type: "assignment",
        text: text,
        emotion: emotion,
        understandability: understandability,
        usefulness: usefulness,
        reliability: reliability,
        forAssignment: assignmentId
    })

    return res.status(201).json(
        new ApiResponse(201, feedback, "Feedback Added Successfully")
    )

})


export {
    createAssignment,
    deleteAssignment,
    getAllAssignment,
    giveAssignmentFeedback
}