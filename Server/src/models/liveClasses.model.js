import mongoose, {Schema} from "mongoose";

const liveClassesSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        topic: {
            type: String, 
            required: true
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true
        }
    }, 
    {
        timestamps: true
    }
)


export const LiveClass = mongoose.model("LiveClass", liveClassesSchema)