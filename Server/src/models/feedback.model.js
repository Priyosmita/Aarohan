import mongoose, {Schema} from "mongoose";

const feedbackSchema = new Schema(
    {
        provider: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        type: {
            type: String,
            required: true
        },
        text: {
            type: String, 
        },
        understandability: {
            type: Number, 
            default: 0
        },
        usefulness: {
            type: Number, 
            default: 0
        },
        reliability: {
            type: Number, 
            default: 0
        },
        emotion: {
            type: String, 
        },
        forClass:{
            type: Schema.Types.ObjectId,
            ref: "Class",
        },
        forAssignment:{
            type: Schema.Types.ObjectId,
            ref: "Assignment",
        },
        forMaterial:{
            type: Schema.Types.ObjectId,
            ref: "Material",
        },
        forStudent:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    }, 
    {
        timestamps: true
    }
)


export const Feedback = mongoose.model("Feedback", feedbackSchema)