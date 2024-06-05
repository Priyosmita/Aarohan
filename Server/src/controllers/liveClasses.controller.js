import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {Class} from "../models/class.model.js"
import { Material } from "../models/material.model.js"
import { LiveClass } from "../models/liveClasses.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ClassMember } from "../models/classMember.model.js";

dotenv.config({
    path: './.env'
})


const createLiveClass = asyncHandler( async (req, res) => {
    const userId = req.user._id
    const classId = req.query.classId;
    const current_user = await User.findById(userId)
    const {startTime, endTime, topic} = req.body
    // console.log(startTime, endTime, topic,classId)
    if (
        [userId, startTime, endTime, topic, classId].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const current_class= await Class.findById(classId)
    if (current_class.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(400, "You are not owner of this class")
    }
    const myLiveClass = await LiveClass.create({
        owner: userId,
        startTime: startTime,
        endTime: endTime,
        topic: topic,
        class: classId
    })
    const createdLiveClass = await LiveClass.findById(myLiveClass._id)
    if (!createdLiveClass) {
        throw new ApiError(400, "Live class not created")
    }
    return res.status(201).json(
        new ApiResponse(200, {user: current_user,
            createdLiveClass:createdLiveClass,
        }, "Live Class Added Successfully")
    )
});

const deleteLiveClass = asyncHandler( async (req, res) => {
    const userId = req.user._id
    const current_user = await User.findById(userId)
    const liveClassId = req.query.liveClassId
    const current_live_class= await LiveClass.findById(liveClassId)
    if (current_live_class.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(400, "You are not owner of this live class")
    }
    const deletedLiveClass = await LiveClass.findByIdAndDelete(liveClassId)
    if (!deletedLiveClass) {
        throw new ApiError(400, "Live class not deleted")
    }
    return res.status(200).json(
        new ApiResponse(200, {user: current_user,
            deletedLiveClass:deletedLiveClass,
        }, "Live Class Deleted Successfully")
    )
})

const getAllLiveClasses = asyncHandler( async (req, res) => {
    const userId = req.user._id
    const current_user = await User.findById(userId)
    const classId = req.query.classId
    const current_class= await Class.findById(classId)
    const classMember = await ClassMember.findOne({class: classId, member: userId, status: "accepted"})
    function getCurrentDateTimeLocal() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    const current_time = getCurrentDateTimeLocal();
    if (!classMember) {
        throw new ApiError(400, "You are not a member of this class")
    }
    const liveClasses = await LiveClass.aggregate([
        {
            $match: {
                class: current_class._id
            }
        },
        {
            $addFields: {
                status: {
                    $switch: {
                        branches: [
                            {
                                case: { $lt: ["$startTime", current_time] },
                                then: {
                                    $cond: {
                                        if: { $lt: ["$endTime", current_time] },
                                        then: "over",
                                        else: "live"
                                    }
                                }
                            },
                            {
                                case: { $gte: ["$startTime", current_time] },
                                then: "upcoming"
                            }
                        ],
                        default: "upcoming"
                    }
                }
            }
        }
    ])

    if (!liveClasses) {
        throw new ApiError(400, "No live classes found")
    }
    return res.status(200).json(
        new ApiResponse(200, liveClasses, "Live Classes Fetched Successfully")
    )
});

export {
    createLiveClass,
    deleteLiveClass,
    getAllLiveClasses
}