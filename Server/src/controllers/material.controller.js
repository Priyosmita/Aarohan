import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {Class} from "../models/class.model.js"
import { Material } from "../models/material.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Feedback } from "../models/feedback.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { ClassMember } from "../models/classMember.model.js";
import axios from "axios"


dotenv.config({
    path: './.env'
})




const uploadMaterial = asyncHandler( async (req, res) => {
    const classId = req.query.classId
    const userId = req.user._id
    const current_user = await User.findById(userId)
    const current_class= await Class.findById(classId)
    if (current_class.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(400, "You are not owner of this class")
    }

    const {name, description,type} = req.body
    if (
        [userId, name, classId, description,type].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const fileLocalPath = req.files?.file[0]?.path;

    if (!fileLocalPath) {
        throw new ApiError(400, " file is required")
    }

    const file = await uploadOnCloudinary(fileLocalPath)
    if (!file) {
        throw new ApiError(400, " file is required")
    }
   

    const myMaterial = await Material.create({
        class: classId,
        file: file.url,
        name:name, 
        description:description,
        owner: current_user._id,
        type:type,
    })

    const createdMaterial = await Material.findById(myMaterial._id)

    if (!createdMaterial) {
        throw new ApiError(500, "Something went wrong while creating the class")
    }

    return res.status(201).json(
        new ApiResponse(200, {user: current_user,
            createdMaterial:createdMaterial,
        }, "Material Added Successfully")
    )
})


const deleteMaterial = asyncHandler( async (req, res) => {
    const classId = req.query.classId
    const materialId = req.query.materialId
    const userId = req.user._id

    const material = await Material.findById(materialId)
    if (!material) {
        throw new ApiError(400, "Material not found")
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

    await Material.findByIdAndDelete(materialId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Material Deleted Successfully")
    )
})


const getAllMaterials = asyncHandler( async (req, res) => {
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

    const materials = await Material.aggregate([
        {
            "$match": {
                "class": current_class._id
            }
        },
        {
            "$sort": {
               "createdAt": 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, materials, "Materials Fetched Successfully")
    )
})


const giveMaterialFeedback = asyncHandler( async (req, res) => {
    const materialId = req.query.materialId
    const material = await Material.findById(materialId)
    if (!material) {
        throw new ApiError(400, "Material not found")
    }
    const userId = req.user._id
    const {understandability, usefulness, reliability,text} = req.body

    const isClassMember = await ClassMember.find({
        member: userId,
        class: material.class,
        status: "accepted"
    })

    if (!isClassMember) {
        throw new ApiError(400, "You are not member of this class")
    }

    if (
        [userId,text, materialId, understandability, usefulness, reliability].some((field) => field === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    

    // TODO: emotion calculation
    let emotion;
    try{
        const response = await axios.post(`${process.env.SENTIMENT_ANALYSIS_API}/sentiment?text=${text}`)
        emotion = response.data.emotion
    }catch(err){
        throw new ApiError(400, "Sentiment Analysis API is not working")
    }

    const isfeedbackGiven = await Feedback.findOne({
        provider: userId,
        type: "material",
        forMaterial: materialId
    })

    if (isfeedbackGiven) {
        throw new ApiError(409, "You have already given feedback for this material")
    }

    const feedback = await Feedback.create({
        provider: userId,
        type: "material",
        understandability: understandability,
        usefulness: usefulness,
        reliability: reliability,
        text: text,
        emotion: emotion,
        forMaterial: materialId,
    })

    return res.status(201).json(
        new ApiResponse(200, feedback, "Feedback Added Successfully")
    )
})





export {
    uploadMaterial,
    deleteMaterial,
    getAllMaterials,
    giveMaterialFeedback
}