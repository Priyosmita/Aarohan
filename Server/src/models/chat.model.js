import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String, 
            required: true,
        },
        isSeen: {
            type: Boolean, 
            required: true,
            default: false
        }

    }, 
    {
        timestamps: true
    }
)


export const Chat = mongoose.model("Chat", chatSchema)