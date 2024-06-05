import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Class } from "../models/class.model.js"
import { Material } from "../models/material.model.js"
import { LiveClass } from "../models/liveClasses.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Roadmap } from "../models/roadmap.model.js";
import { Submission } from "../models/submissions.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ClassMember } from "../models/classMember.model.js";
import axios from "axios";

dotenv.config({
    path: './.env'
})

const createRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const alreadyExist = await Roadmap.find({ owner: userId })
    if (alreadyExist.length > 0) {
        Roadmap.deleteMany({ owner: userId })
    }
    const { roadmap,subject } = req.body
    if (
        [userId, roadmap, subject].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    await Roadmap.deleteMany({ owner: userId })

    for (let i = 0; i < roadmap.length; i++) {
        const myRoadmap = await Roadmap.create({
            owner: userId,
            topic: subject,
            description: roadmap[i],
            index: i + 1
        })
    }
    return res.status(201).json(
        new ApiResponse(200, {
            user: userId,
            roadmap: roadmap,
        }, "Roadmap Added Successfully")
    )

})


const getRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const roadmap = await Roadmap.find({ owner: userId })
    return res.status(200).json(
        new ApiResponse(200, {
            roadmap: roadmap,
        }, "Roadmap Fetched Successfully")
    )
})

const deleteRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const roadmap = await Roadmap.find({ owner: userId })
    if (roadmap.length === 0) {
        throw new ApiError(400, "No roadmap found")
    }
    await Roadmap.deleteMany({ owner: userId._id })
    return res.status(200).json(
        new ApiResponse(200, {
            user: userId,
        }, "Roadmap Deleted Successfully")
    )
})

const markDoneRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const roadmapId = req.query.roadmapId
    const roadmap = await Roadmap.findById(roadmapId)
    if (!roadmap) {
        throw new ApiError(400, "Roadmap not found")
    }
    if (roadmap.status === "done") {
        throw new ApiError(400, "Roadmap already marked as done")
    }
    const updatedRoadmap = await Roadmap.findByIdAndUpdate (roadmapId, { status: "done" })
    return res.status(200).json(
        new ApiResponse(200, {
            updatedRoadmap: updatedRoadmap,
        }, "Roadmap Marked as Done Successfully")
    )
})


const markPendingRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const roadmapId = req.query.roadmapId
    const roadmap = await Roadmap.findById(roadmapId)
    if (!roadmap) {
        throw new ApiError(400, "Roadmap not found")
    }
    if (roadmap.status === "pending") {
        throw new ApiError(400, "Roadmap already marked as pending")
    }
    const updatedRoadmap = await Roadmap.findByIdAndUpdate (roadmapId, { status: "pending" })
    return res.status(200).json(
        new ApiResponse(200, {
            updatedRoadmap: updatedRoadmap,
        }, "Roadmap Marked as Pending Successfully")
    )
})

const updateMarksRoadmap = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const roadmapId = req.query.roadmapId
    const marks = parseInt(req.query.marks)
    const roadmap = await Roadmap.findById(roadmapId)
    if (!roadmap) {
        throw new ApiError(400, "Roadmap not found")
    }
    const updatedRoadmap = await Roadmap.findByIdAndUpdate (roadmapId, { marks: marks })
    return res.status(200).json(
        new ApiResponse(200, {
            updatedRoadmap: updatedRoadmap,
        }, "Marks Updated Successfully")
    )
})

const generateRoadmap = asyncHandler(async (req, res) => {
    const text = req.body.text;
    const userId = req.user._id;
    const hour = req.body.hour;
    const deadline = req.body.deadline;

    const assignment_details = await Submission.aggregate([{
        $match: {
            owner: userId,
        }
    },
    {
        $project: {
            marks: 1,
            fullMarks: 1,
            createdAt: 1
        }
    }])

    let totalFullMarks = 0;
    let totalMarks = 0;

    assignment_details.forEach(submission => {
        if (submission.marks !== 'unmarked') {
            totalFullMarks += submission.fullMarks;
            totalMarks += submission.marks;
        }
    });

    let accuracy = (totalMarks / totalFullMarks) * 100;
    if (accuracy < 20){
        accuracy = 20;
    }

    try {
        const roadmap = await axios.post(`${process.env.GENERATE_ROADMAP_API}/generate_roadmap?text=${text}&hour=${hour}&deadline=${deadline}&accuracy=${accuracy}`);
        return res.status(200).json(
            new ApiResponse(200, {
                roadmap:roadmap.data.roadmap,
                subject: text,
            }, "Roadmap Generated Successfully")
        )
    } catch (error) {
        
        return res.status(400).json(
            new ApiResponse(400, {
                error: error,
            }, "Error in Generating Roadmap")
        )
    }

})

const generateQuestions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const roadmapId = req.query.roadmapId;
    const roadmap = await Roadmap.findById(roadmapId);
    if (!roadmap) {
        throw new ApiError(400, "Roadmap not found")
    }

    const subject = roadmap.topic;
    const topic = roadmap.description;

    const assignment_details = await Submission.aggregate([{
        $match: {
            owner: userId,
        }
    },
    {
        $project: {
            marks: 1,
            fullMarks: 1,
            createdAt: 1
        }
    }])

    let totalFullMarks = 0;
    let totalMarks = 0;

    assignment_details.forEach(submission => {
        if (submission.marks !== 'unmarked') {
            totalFullMarks += submission.fullMarks;
            totalMarks += submission.marks;
        }
    });

    let accuracy = (totalMarks / totalFullMarks) * 100;
    if (accuracy < 20){
        accuracy = 20;
    }

    try {
        const questions = await axios.post(`${process.env.GENERATE_QUESTION_API}/generate_questions?subject=${subject}&topic=${topic}&accuracy=${accuracy}`);
        return res.status(200).json(
            new ApiResponse(200, {
                questions:questions.data,
            }, "Questions Generated Successfully")
        )
    } catch (error) {
        
        return res.status(400).json(
            new ApiResponse(400, {
                error: error,
            }, "Error in Generating Questions")
        )
    }


})

export { createRoadmap, getRoadmap, deleteRoadmap, markDoneRoadmap, markPendingRoadmap, updateMarksRoadmap ,generateRoadmap, generateQuestions}
