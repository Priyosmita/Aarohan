import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { Class } from "../models/class.model.js"
import { Chat } from "../models/chat.model.js";
import { ClassMember } from "../models/classMember.model.js"
import { Material } from "../models/material.model.js"
import { Assignment } from "../models/assignment.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Feedback } from "../models/feedback.model.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import dotenv from "dotenv"
const { ObjectId } = mongoose.Types;
import axios from "axios"

dotenv.config({
    path: './.env'
})


const createClass = asyncHandler(async (req, res) => {


    const current_user = await User.findById(req.user?._id)
    const { classname, title, description, category } = req.body
    // console.log(classname)
    // console.log(title)
    // console.log(description)
    // console.log(category)
    if (
        [classname, title, description, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }


    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }


    const myClass = await Class.create({
        classname,
        thumbnail: thumbnail.url,
        title,
        description,
        category,
        owner: current_user._id,
    })

    const createdClass = await Class.findById(myClass._id)

    if (!createdClass) {
        throw new ApiError(500, "Something went wrong while creating the class")
    }

    const createdClassMember = await ClassMember.create({
        class: createdClass._id,
        member: current_user._id,
        role: "mentor",
        status: "accepted"
    })

    if (!createdClassMember) {
        throw new ApiError(500, "Something went wrong while creating the class")
    }


    return res.status(201).json(
        new ApiResponse(200, {
            user: current_user,
            createdClass: createdClass,
            createdClassMember: createdClassMember
        }, "Class Created Successfully")
    )

})



const updateClass = asyncHandler(async (req, res) => {

    const { classname, title, description, category } = req.body
    const classId = req.params.id

    if (
        [classname, title, description, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    myClass.classname = classname
    myClass.title = title
    myClass.description = description
    myClass.category = category

    myClass.save()

    const updatedClass = await Class.findById(myClass._id)

    return res.status(200).json(
        new ApiResponse(200, updatedClass, "Class Updated Successfully")
    )
})


const updateThumbnail = asyncHandler(async (req, res) => {

    const classId = req.params.id

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(400, "Thumbnail file is required")
    }

    myClass.thumbnail = thumbnail.url
    myClass.save()

    const updatedClass = await Class.findById(myClass._id)

    return res.status(200).json(
        new ApiResponse(200, updatedClass, "Thumbnail Updated Successfully")
    )
})

//TODO: Delete Class

const viewAllJoinInvitation = asyncHandler(async (req, res) => {
    const classId = req.query.id
    // console.log(classId)
    const myClass = await Class.findById(classId)
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }
    const classMembers = await ClassMember.aggregate([
        {
            "$match": {
                "class": myClass._id,
                "status": "pending"
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "member",
                "foreignField": "_id",
                "as": "memberInfo"
            }
        },
        {
            "$unwind": "$memberInfo"
        },
        {
            "$project": {
                "memberInfo.password": 0,
                "memberInfo.refreshToken": 0
            }
        }
    ]
    )

    return res.status(200).json(
        new ApiResponse(200, classMembers, "Join Invitations fetched successfully")
    )
})


const acceptJoinInvitation = asyncHandler(async (req, res) => {

    const classId = req.query.id
    const memberId = req.body.memberId

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const classMember = await ClassMember.findOne({
        class: classId,
        member: memberId
    })

    if (!classMember) {
        throw new ApiError(404, "Member not found")
    }

    classMember.status = "accepted"
    classMember.save()

    const updatedClassMember = await ClassMember.findById(classMember._id)

    return res.status(200).json(
        new ApiResponse(200, updatedClassMember, "Member accepted successfully")
    )
})


const rejectJoinInvitation = asyncHandler(async (req, res) => {

    const classId = req.query.id
    const memberId = req.body.memberId

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const classMember = await ClassMember.findOne({
        class: classId,
        member: memberId
    })

    if (!classMember) {
        throw new ApiError(404, "Member not found")
    }

    await ClassMember.findByIdAndDelete(classMember._id)

    return res.status(200).json(
        new ApiResponse(200, [], "Member rejected successfully")
    )
})



const getMyClassesForMentor = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user?._id)
    const myClasses = await ClassMember.aggregate([
        {
            '$match': {
                'member': current_user._id,
                'role': 'mentor'
            }
        }, {
            '$lookup': {
                'from': 'classes',
                'localField': 'class',
                'foreignField': '_id',
                'as': 'classInfo'
            }
        }, {
            '$lookup': {
                'from': 'users',
                'localField': 'classInfo.owner',
                'foreignField': '_id',
                'as': 'ownerInfo'
            }
        }, {
            '$unset': [
                'ownerInfo.password', 'ownerInfo.refreshToken'
            ]
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, myClasses, "My Classes fetched successfully")
    )
})

const getStudentsHavingDoubts = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user?._id)
    const students = await Chat.aggregate([
        {
            "$match": {
                "receiver": current_user._id
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
            "$unwind": "$senderInfo"
        },
        {
            "$group": {
                "_id": "$senderInfo._id",
                "senderInfo": { "$first": "$senderInfo" }
            }
        },
        {
            "$project": {
                "senderInfo.password": 0,
                "senderInfo.refreshToken": 0
            }
        }
    ]
    )

    return res.status(200).json(
        new ApiResponse(200, students, "Students having doubts fetched successfully")
    )
})

const removeStudentFromClass = asyncHandler(async (req, res) => {
    const classId = req.query.id
    const memberId = req.query.memberId

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const classMember = await ClassMember.findOne({
        class: classId,
        member: memberId
    })

    if (!classMember) {
        throw new ApiError(404, "Member not found")
    }

    await ClassMember.findByIdAndDelete(classMember._id)

    return res.status(200).json(
        new ApiResponse(200, [], "Member removed successfully")
    )
})


const getMyClassDashboardMentor = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user?._id).select("-password -refreshToken")
    const classId = req.query.id
    const myClass = await Class.findById(classId)
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    if (myClass.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(401, "unauthorized")
    }

    const classInfo = await Class.aggregate([
        {
            "$match": {
                "_id": myClass._id
            }
        },
        {
            "$lookup": {
                "from": "classmembers",
                "localField": "_id",
                "foreignField": "class",
                "as": "members"
            }
        },
        {
            "$unwind": "$members"
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "members.member",
                "foreignField": "_id",
                "as": "memberInfo"
            }
        },
        {
            "$unwind": "$memberInfo"
        },
        {
            "$match": {
                "members.status": "accepted"
            }
        },
        {
            "$project": {
                "memberInfo.password": 0,
                "memberInfo.refreshToken": 0
            }
        }
    ]
    )
    return res.status(200).json(
        new ApiResponse(200, { class: myClass, members: classInfo, owner: current_user }, "Class Info fetched successfully")
    )
})


const deleteClass = asyncHandler(async (req, res) => {
    const classId = req.query.id
    const current_user = await User.findById(req.user?._id)
    const myClass = await Class.findById(classId)
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }
    if (myClass.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(401, "Not Class Mentor")
    }
    await Class.findByIdAndDelete(classId)
    await ClassMember.deleteMany({ class: classId })
    await Material.deleteMany({ class: classId })
    await Assignment.deleteMany({ class: classId })
    return res.status(200).json(
        new ApiResponse(200, null, "Class deleted successfully")
    )
})


const giveStudentFeedback = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user._id)
    const classId = req.query.id
    const studentId = req.query.studentId
    const myStudent = await User.findById(studentId)
    if (!myStudent) {
        throw new ApiError(404, "Student not found")
    }
    const current_class = await Class.findById(classId)
    if (current_class.owner.toString() !== current_user._id.toString()) {
        throw new ApiError(401, "unauthorized")
    }
    const isany = await Feedback.find({ provider: current_user._id, type: "student", forStudent: studentId, forClass: classId })

    //TODO: Add emotion
    const { text } = req.body
    let emotion;
    if (isany.length > 0) {
        const feedback = await Feedback.findByIdAndUpdate(isany[0]._id, { text: text, emotion: emotion })
        return res.status(200).json(
            new ApiResponse(200, feedback, "Feedback Updated successfully")
        )
    }
    try {
        const response = await axios.post(`${process.env.SENTIMENT_ANALYSIS_API}/sentiment?text=${text}`)
        emotion = response.data.emotion
    } catch (err) {
        throw new ApiError(400, "Sentiment Analysis API is not working")
    }
    const feedback = await Feedback.create({
        provider: current_user._id,
        type: "student",
        text: text,
        emotion: emotion,
        forStudent: studentId,
        forClass: classId
    })
    return res.status(200).json(
        new ApiResponse(200, feedback, "Feedback given successfully")
    )
})



// Student Class Controllers

const joinClass = asyncHandler(async (req, res) => {

    const classId = req.body.id
    const current_user = await User.findById(req.user?._id)

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const classMember = await ClassMember.findOne({
        class: classId,
        member: current_user._id
    })

    if (classMember?.status === "accepted") {
        throw new ApiError(400, "You are already a member of this class")
    }
    if (classMember?.status === "pending") {
        throw new ApiError(409, "You have already requested to join this class")
    }

    await ClassMember.create({
        class: classId,
        member: current_user._id,
        role: "student",
        status: "pending"
    })

    const createdClassMember = await ClassMember.findById(ClassMember._id)

    return res.status(200).json(
        new ApiResponse(200, createdClassMember, "Request to join class sent successfully")
    )
})


const leaveClass = asyncHandler(async (req, res) => {
    const classId = req.query.id
    const current_user = await User.findById(req.user?._id)

    const myClass = await Class.findById(classId)

    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const classMember = await ClassMember.findOne({
        class: classId,
        member: current_user._id
    })

    if (!classMember) {
        throw new ApiError(400, "You are not a member of this class")
    }

    await ClassMember.findByIdAndDelete(classMember._id)

    return res.status(200).json(
        new ApiResponse(200, null, "You have left the class successfully")
    )
})



const getAllClassesForStudent = asyncHandler(async (req, res) => {
    const query = req.query.input
    let classes;
    if (query == "") {
        classes = await Class.aggregate([
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner"
                }
            },
            {
                "$lookup": {
                    "from": "classmembers",
                    "localField": "_id",
                    "foreignField": "class",
                    "as": "members"
                }
            },
            {
                "$addFields": {
                    "owner": {
                        "$map": {
                            "input": "$owner",
                            "as": "owner",
                            "in": {
                                "_id": "$$owner._id",
                                "fullName": "$$owner.fullName",
                                "username": "$$owner.username",
                                "email": "$$owner.email",
                                "createdAt": "$$owner.createdAt"
                            }
                        }
                    },
                    "membersCount": {
                        "$size": "$members"
                    }
                }
            },
            {
                "$unset": [
                    "members",
                    "owner.password",
                    "owner.refreshToken"
                ]
            }
        ]);
    } else {
        classes = await Class.aggregate([
            {
                "$match": {
                    "classname": query
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner"
                }
            },
            {
                "$lookup": {
                    "from": "classmembers",
                    "localField": "_id",
                    "foreignField": "class",
                    "as": "members"
                }
            },
            {
                "$addFields": {
                    "owner": {
                        "$map": {
                            "input": "$owner",
                            "as": "owner",
                            "in": {
                                "_id": "$$owner._id",
                                "username": "$$owner.username",
                                "email": "$$owner.email",
                                "createdAt": "$$owner.createdAt"
                            }
                        }
                    },
                    "membersCount": {
                        "$size": "$members"
                    }
                }
            },
            {
                "$unset": [
                    "members",
                    "owner.password",
                    "owner.refreshToken"
                ]
            }
        ]);
    }

    return res.status(200).json(
        new ApiResponse(200, classes, "Classes fetched successfully")
    )
})


const getMyClassesForStudent = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user?._id)
    const query = req.query.input
    let myClasses;
    if (query == "") {
        myClasses = await ClassMember.aggregate([
            {
                '$match': {
                    'member': current_user._id,
                    'role': 'student',
                    'status': 'accepted'
                }
            }, {
                '$lookup': {
                    'from': 'classes',
                    'localField': 'class',
                    'foreignField': '_id',
                    'as': 'classInfo'
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'classInfo.owner',
                    'foreignField': '_id',
                    'as': 'ownerInfo'
                }
            }, {
                '$unset': [
                    'ownerInfo.password', 'ownerInfo.refreshToken'
                ]
            }
        ])
    } else {
        myClasses = await ClassMember.aggregate([
            {
                '$lookup': {
                    'from': 'classes',
                    'localField': 'class',
                    'foreignField': '_id',
                    'as': 'classInfo'
                }
            }, {
                '$match': {
                    '$or': [
                        {
                            'classInfo.classname': query
                        }, {
                            'member': current_user._id
                        }
                    ]
                }
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'classInfo.owner',
                    'foreignField': '_id',
                    'as': 'ownerInfo'
                }
            }, {
                '$unset': [
                    'ownerInfo.password', 'ownerInfo.refreshToken'
                ]
            }
        ])
    }

    return res.status(200).json(
        new ApiResponse(200, myClasses, "My Classes fetched successfully")
    )

})




const getAllMentorsForStudent = asyncHandler(async (req, res) => {
    const query = req.params.input
    let mentors;
    if (query == "") {
        mentors = await User.aggregate([
            {
                $match: {
                    role: "mentor"
                }
            },
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    email: 1,
                    role: 1,
                    avatar: 1
                }
            }
        ])
    } else {
        mentors = await User.aggregate([
            {
                $match: {
                    role: "mentor"
                }
            },
            {
                $match: {
                    name: query
                }
            },
            {
                $project: {
                    _id: 1,
                    fullName: 1,
                    email: 1,
                    role: 1,
                    avatar: 1
                }
            }
        ])
    }

    return res.status(200).json(
        new ApiResponse(200, mentors, "Mentors fetched successfully")
    )
})

const getMyClassDashboardStudent = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user?._id)
    const classId = req.query.id
    const myClass = await Class.findById(classId)
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }
    const classMember = await ClassMember.findOne({
        class: classId,
        member: current_user._id,
        role: "student",
        status: "accepted"
    })
    if (!classMember) {
        throw new ApiError(401, "unauthorized")
    }
    const classInfo = await Class.aggregate([
        {
            "$match": {
                "_id": myClass._id
            }
        },
        {
            "$lookup": {
                "from": "classmembers",
                "localField": "_id",
                "foreignField": "class",
                "as": "members"
            }
        },
        {
            "$unwind": "$members"
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "members.member",
                "foreignField": "_id",
                "as": "memberInfo"
            }
        },
        {
            "$unwind": "$memberInfo"
        },
        {
            "$match": {
                "members.status": "accepted"
            }
        },
        {
            "$project": {
                "memberInfo.password": 0,
                "memberInfo.refreshToken": 0
            }
        }
    ]
    )

    const owner = await User.findById(myClass.owner).select("-password -refreshToken")


    return res.status(200).json(
        new ApiResponse(200, { class: myClass, members: classInfo, owner: owner }, "Class Info fetched successfully")
    )

})

const giveClassFeedback = asyncHandler(async (req, res) => {
    const current_user = await User.findById(req.user._id)
    const classId = req.query.id
    const myClass = await Class.findById(classId)
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }

    const { text } = req.body

    const classMember = await ClassMember.findOne({
        class: classId,
        member: current_user._id,
        role: "student",
        status: "accepted"
    })
    if (!classMember) {
        throw new ApiError(401, "unauthorized")
    }

    const isany = await Feedback.find({ provider: current_user._id, type: "class", forClass: classId })

    // TODO: Add emotion


    let emotion;
    try {
        const response = await axios.post(`${process.env.SENTIMENT_ANALYSIS_API}/sentiment?text=${text}`)
        emotion = response.data.emotion
    } catch (err) {
        throw new ApiError(400, "Sentiment Analysis API is not working")
    }
    if (isany.length > 0) {
        const feedback = await Feedback.findByIdAndUpdate(isany[0]._id, { text: text, emotion: emotion })
        return res.status(200).json(
            new ApiResponse(200, feedback, "Feedback Updated successfully")
        )
    }
    const feedback = await Feedback.create({
        provider: current_user._id,
        type: "class",
        text: text,
        emotion: emotion,
        forClass: myClass._id,
    })
    return res.status(200).json(
        new ApiResponse(200, feedback, "Feedback given successfully")
    )

})

const getClassAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const classId = req.query.classId;
    const myClass = await Class.findById(classId);
    if (!myClass) {
        throw new ApiError(404, "Class not found")
    }
    const classMember = await ClassMember.findOne({
        class: classId,
        member: userId,
        status: "accepted"
    })
    if (!classMember) {
        throw new ApiError(401, "unauthorized")
    }

    const classFeedbacks = await Feedback.aggregate([
        {
            $match: {
                forClass: myClass._id,
            }
        },
        {
            $group: {
                _id: "$emotion",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                emotion: "$_id",
                count: 1,
                _id: 0
            }
        }
    ]);

    const assignmentFeedbacksEmotions = await Assignment.aggregate([
        {
            $match: {
                class: myClass._id,
            }
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "_id",
                foreignField: "forAssignment",
                as: "feedbacks"
            }
        },
        {
            $unwind: {
                path: "$feedbacks",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                description: { $first: "$description" },
                feedbacks: { $push: "$feedbacks" }
            }
        },
        {
            $addFields: {
                positiveFeedbackCount: {
                    $size: {
                        $filter: {
                            input: "$feedbacks",
                            as: "feedback",
                            cond: { $eq: ["$$feedback.emotion", "POSITIVE"] }
                        }
                    }
                },
                negativeFeedbackCount: {
                    $size: {
                        $filter: {
                            input: "$feedbacks",
                            as: "feedback",
                            cond: { $eq: ["$$feedback.emotion", "NEGATIVE"] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                assignmentId: "$_id",
                description: 1,
                positiveFeedbackCount: 1,
                negativeFeedbackCount: 1,
                _id: 0
            }
        }
    ])

    const assignmentStarsCount = await Assignment.aggregate([
        {
            $match: {
                class: myClass._id // Replace myClass._id with the actual class ID
            }
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "_id",
                foreignField: "forAssignment",
                as: "feedbacks"
            }
        },
        {
            $addFields: {
                totalFeedbackCount: { $size: "$feedbacks" },
                fullUnderstandabilityStars: { $multiply: [5, { $size: "$feedbacks" }] },
                fullUsefulnessStars: { $multiply: [5, { $size: "$feedbacks" }] },
                fullReliabilityStars: { $multiply: [5, { $size: "$feedbacks" }] },
                totalUnderstandabilityStars: { $sum: "$feedbacks.understandability" },
                totalUsefulnessStars: { $sum: "$feedbacks.usefulness" },
                totalReliabilityStars: { $sum: "$feedbacks.reliability" }
            }
        },
        {
            $project: {
                _id: 0,
                assignmentId: "$_id",
                description: "$description",
                name: 1,
                totalFeedbackCount: 1,
                fullUnderstandabilityStars: 1,
                fullUsefulnessStars: 1,
                fullReliabilityStars: 1,
                totalUnderstandabilityStars: 1,
                totalUsefulnessStars: 1,
                totalReliabilityStars: 1
            }
        }
    ]);


    const materialFeedbacksEmotions = await Material.aggregate([
        {
            $match: {
                class: myClass._id,
            }
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "_id",
                foreignField: "forMaterial",
                as: "feedbacks"
            }
        },
        {
            $unwind: {
                path: "$feedbacks",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                description: { $first: "$name" },
                feedbacks: { $push: "$feedbacks" }
            }
        },
        {
            $addFields: {
                positiveFeedbackCount: {
                    $size: {
                        $filter: {
                            input: "$feedbacks",
                            as: "feedback",
                            cond: { $eq: ["$$feedback.emotion", "POSITIVE"] }
                        }
                    }
                },
                negativeFeedbackCount: {
                    $size: {
                        $filter: {
                            input: "$feedbacks",
                            as: "feedback",
                            cond: { $eq: ["$$feedback.emotion", "NEGATIVE"] }
                        }
                    }
                }
            }
        },
        {
            $project: {
                materialId: "$_id",
                description: 1,
                positiveFeedbackCount: 1,
                negativeFeedbackCount: 1,
                _id: 0
            }
        }
    ])

    const materialStarsCount = await Material.aggregate([
        {
            $match: {
                class: myClass._id // Replace myClass._id with the actual class ID
            }
        },
        {
            $lookup: {
                from: "feedbacks",
                localField: "_id",
                foreignField: "forMaterial",
                as: "feedbacks"
            }
        },
        {
            $addFields: {
                totalFeedbackCount: { $size: "$feedbacks" },
                fullUnderstandabilityStars: { $multiply: [5, { $size: "$feedbacks" }] },
                fullUsefulnessStars: { $multiply: [5, { $size: "$feedbacks" }] },
                fullReliabilityStars: { $multiply: [5, { $size: "$feedbacks" }] },
                totalUnderstandabilityStars: { $sum: "$feedbacks.understandability" },
                totalUsefulnessStars: { $sum: "$feedbacks.usefulness" },
                totalReliabilityStars: { $sum: "$feedbacks.reliability" }
            }
        },
        {
            $project: {
                _id: 0,
                materialId: "$_id",
                description: "$name",
                name: 1,
                totalFeedbackCount: 1,
                fullUnderstandabilityStars: 1,
                fullUsefulnessStars: 1,
                fullReliabilityStars: 1,
                totalUnderstandabilityStars: 1,
                totalUsefulnessStars: 1,
                totalReliabilityStars: 1
            }
        }
    ]);

    const totalMaterials = await Material.countDocuments({ class: myClass._id });
    const totalAssignments = await Assignment.countDocuments({ class: myClass._id });
    const totalStudents = await ClassMember.countDocuments({ class: myClass._id, role: "student", status: "accepted" });

    return res.status(200).json(
        new ApiResponse(200, { classFeedbacks, 
            assignmentFeedbacksEmotions, 
            assignmentStarsCount, 
            materialFeedbacksEmotions, 
            materialStarsCount,
            totalMaterials,
            totalAssignments,
            totalStudents
        }, "Class Analytics fetched successfully")
    )

})

export {
    createClass,
    updateClass,
    updateThumbnail,
    joinClass,
    leaveClass,
    acceptJoinInvitation,
    rejectJoinInvitation,
    getAllClassesForStudent,
    getMyClassesForStudent,
    getMyClassesForMentor,
    getAllMentorsForStudent,
    removeStudentFromClass,
    getMyClassDashboardStudent,
    getMyClassDashboardMentor,
    viewAllJoinInvitation,
    getStudentsHavingDoubts,
    deleteClass,
    giveClassFeedback,
    giveStudentFeedback,
    getClassAnalytics
}