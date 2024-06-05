import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import { Chat } from "../models/chat.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})




const getChatsWithMentor = asyncHandler( async (req, res) => {

    const mentorId = req.query.mentorId
    const studentId = req.user._id
    if(!mentorId) {
        throw new ApiError(400, "Mentor is required")
    }

    const mentor = await User.findById(mentorId)

    if(!mentor) {
        throw new ApiError(404, "Mentor not found")
    }

    const chats = await Chat.aggregate([
        {
          "$match": {
            "$or": [
            {"sender": studentId,
            "receiver": mentor._id} ,
            {"sender": mentor._id,
            "receiver": studentId}
            ]
          }
        },
        {
          "$lookup": {
            "from": "users",
            "localField": "receiver",
            "foreignField": "_id",
            "as": "receiverInfo"
          }
        },
        {
          "$lookup": {
            "from": "users",
            "localField": "sender",
            "foreignField": "_id",
            "as": "senderInfo"
          }
        },
        {
          "$unwind": "$receiverInfo"
        },
        {
          "$unwind": "$senderInfo"
        },
        {
          "$sort": {
            "createdAt": 1
          }
        },
        {
          "$project": {
            "message": 1,
            "isSeen": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "__v": 1,
            "_id": 1,
            "receiverInfo._id": 1,
            "receiverInfo.username": 1,
            "receiverInfo.email": 1,
            "receiverInfo.fullName": 1,
            "receiverInfo.avatar": 1,
            "receiverInfo.createdAt": 1,
            "receiverInfo.updatedAt": 1,
            "senderInfo._id": 1,
            "senderInfo.username": 1,
            "senderInfo.email": 1,
            "senderInfo.fullName": 1,
            "senderInfo.avatar": 1,
            "senderInfo.createdAt": 1,
            "senderInfo.updatedAt": 1
          }
        }
      ]
      
      
)
    return res.status(200).json(new ApiResponse(201, chats,"Chat fetched successfully"))

} )


const getChatsWithStudent = asyncHandler( async (req, res) => {

    const mentorId = req.user._id
    const studentId = req.query.studentId

    if(!studentId) {
        throw new ApiError(400, "Student is required")
    }

    const student = await User.findById(studentId)

    if(!student) {
        throw new ApiError(404, "Student not found")
    }

    const chats = await Chat.aggregate([
      {
        "$match": {
          "$or": [
            { "sender": mentorId, "receiver": student._id },
            { "sender": student._id, "receiver": mentorId }
          ]
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "receiver",
          "foreignField": "_id",
          "as": "receiverInfo"
        }
      },
      {
        "$lookup": {
          "from": "users",
          "localField": "sender",
          "foreignField": "_id",
          "as": "senderInfo"
        }
      },
      {
        "$unwind": "$receiverInfo"
      },
      {
        "$unwind": "$senderInfo"
      },
      {
        "$sort": {
          "createdAt": 1
        }
      },
      {
        "$project": {
          "message": 1,
          "isSeen": 1,
          "createdAt": 1,
          "updatedAt": 1,
          "__v": 1,
          "_id": 1,
          "receiverInfo._id": 1,
          "receiverInfo.username": 1,
          "receiverInfo.email": 1,
          "receiverInfo.fullName": 1,
          "receiverInfo.avatar": 1,
          "receiverInfo.createdAt": 1,
          "receiverInfo.updatedAt": 1,
          "senderInfo._id": 1,
          "senderInfo.username": 1,
          "senderInfo.email": 1,
          "senderInfo.fullName": 1,
          "senderInfo.avatar": 1,
          "senderInfo.createdAt": 1,
          "senderInfo.updatedAt": 1
        }
      }
    ]
    )

      // console.log(chats)

    return res.status(200).json(new ApiResponse(201, chats,"Chats fetched successfully"))

} )


const chatWithMentor = asyncHandler( async (req, res) => {
    
        const mentorId = req.query.mentorId
        const studentId = req.user._id
        const message = req.body.message
    
        if(!mentorId) {
            throw new ApiError(400, "Mentor is required")
        }
    
        if(!message) {
            throw new ApiError(400, "Message is required")
        }
    
        const mentor = await User.findById(mentorId)
    
        if(!mentor) {
            throw new ApiError(404, "Mentor not found")
        }
    
        const chat = new Chat({
            sender: studentId,
            receiver: mentorId,
            message: message
        })
    
        await chat.save()
    
        return res.status(201).json(new ApiResponse(201, chat,"Chat created successfully"))
} )


const chatWithStudent = asyncHandler( async (req, res) => {
        
            const mentorId = req.user._id
            const studentId = req.query.studentId
            const message = req.body.message
        
            if(!studentId) {
                throw new ApiError(400, "Student is required")
            }
        
            if(!message) {
                throw new ApiError(400, "Message is required")
            }
        
            const student = await User.findById(studentId)
        
            if(!student) {
                throw new ApiError(404, "Student not found")
            }
        
            const chat = new Chat({
                sender: mentorId,
                receiver: studentId,
                message: message
            })
        
            await chat.save()
        
            return res.status(201).json(new ApiResponse(201, chat,"Chat created successfully"))
})


export {
    getChatsWithMentor,
    getChatsWithStudent,
    chatWithMentor,
    chatWithStudent,
}