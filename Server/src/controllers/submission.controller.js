import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Assignment } from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Class } from "../models/class.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ClassMember } from "../models/classMember.model.js";
import { Submission } from "../models/submissions.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

dotenv.config({
    path: './.env'
})




const submitAssignment = asyncHandler(async (req, res) => {
    const assignmentId = req.query.assignmentId
    const userId = req.user._id
    const current_user = await User.findById(userId)
    const submission = await Submission.findOne(
        { assignment: assignmentId, owner: userId }
    )
    if (submission) {
        throw new ApiError(409, "You have already submitted this assignment")
    }

    const { description } = req.body
    if (
        [userId, assignmentId, description].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const assignment = await Assignment.findById(assignmentId)


    const documentLocalPath = req.files?.document[0]?.path;
    if (!documentLocalPath) {
        throw new ApiError(400, " file is required")
    }

    const doc = await uploadOnCloudinary(documentLocalPath)
    if (!doc) {
        throw new ApiError(400, " file is required")
    }


    const mySubmission = await Submission.create({
        assignment: assignmentId,
        fullMarks:assignment.fullmarks,
        document: doc.url,
        description: description,
        owner: current_user._id,
    })

    const createdSubmission = await Submission.findById(mySubmission._id)

    if (!createdSubmission) {
        throw new ApiError(500, "Something went wrong while creating the class")
    }

    return res.status(201).json(
        new ApiResponse(200, {
            user: current_user,
            createdSubmission: createdSubmission,
        }, "Submission Added Successfully")
    )
})


const viewSubmission = asyncHandler(async (req, res) => {
    const assignmentId = req.query.assignmentId
    const userId = req.user._id

    const submission = await Submission.findOne(
        { assignment: assignmentId, owner: userId }
    )

    return res.status(200).json(
        new ApiResponse(200, submission, "Submission Found")
    )
})


// mentor routes

const viewAllSubmissions = asyncHandler(async (req, res) => {
    const assignmentId = req.query.assignmentId
    const userId = req.user._id

    const assignment = await Assignment.findById(
        assignmentId
    )

    const class_found = await Class.findById(assignment.class)
    if (class_found.owner.toString() != userId.toString()) {
        throw new ApiError(400, "You are not mentor of this class")
    }

    if (!assignment) {
        throw new ApiError(400, "Assignment not found")
    }

    const submissions = await Submission.aggregate([
        {
            $match: {
                assignment: assignment._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                "owner.password": 0,
                "owner.email": 0,
                "owner.createdAt": 0,
                "owner.updatedAt": 0,
                "owner.__v": 0
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, submissions, "Submissions Found")
    )
})

const markSubmission = asyncHandler(async (req, res) => {
    const submissionId = req.query.submissionId
    const userId = req.user._id


    const submission = await Submission.findById(
        submissionId
    )

    const assignment = await Assignment.findById(
        submission.assignment
    )

    const class_found = await Class.findById(assignment.class)
    if (class_found.owner.toString() != userId.toString()) {
        throw new ApiError(400, "You are not mentor of this class")
    }

    if (!submission) {
        throw new ApiError(400, "Submission not found")
    }

    const { marks } = req.body
    if (
        [marks].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    submission.marks = marks
    await submission.save()

    return res.status(200).json(
        new ApiResponse(200, { submission }, "Submission Marked")
    )
})







export {
    submitAssignment,
    viewSubmission,
    viewAllSubmissions,
    markSubmission
}