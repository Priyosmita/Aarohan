import mongoose, {Schema} from "mongoose";

const roadmapSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        index: {
            type: Number, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        marks: {
            type: Number, 
            default: 0
        },
        fullMarks: {
            type: Number, 
            default: 5
        },
        status: {
            type: String,
            default: "pending" 
        }
    }, 
    {
        timestamps: true
    }
)


export const Roadmap = mongoose.model("Roadmap", roadmapSchema)