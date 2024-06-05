import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String, 
            required: true,
        },
        material: {
            type: Schema.Types.ObjectId,
            ref: "Material",
            required: true

        }
    }, 
    {
        timestamps: true
    }
)


export const Comment = mongoose.model("Comment", commentSchema)