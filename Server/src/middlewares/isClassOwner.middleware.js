import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { Class } from "../models/class.model.js";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

export const isClassOwner = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        const classId = req.query.id
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (user.role !== "mentor") {
            
            throw new ApiError(401, "Not A mentor")
        }
        

            const classOwner = await Class.findById(classId)
            // console.log(classOwner.owner)
            // console.log(user._id)

            const classfilter = await Class.find({_id: classId, owner: user._id})
            if (classfilter.length === 0) {
                throw new ApiError(401, "Not the class owner")
            }
      

        req.user = user;
        // req.classId = classId;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})