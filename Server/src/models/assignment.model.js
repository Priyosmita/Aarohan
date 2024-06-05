import mongoose, {Schema} from "mongoose";

const assignmentSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        description: {
            type: String, 
            required: true,
        },
        document: {
            type: String, 
            required: true
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true
        },
        fullmarks: {
            type: String, 
            required: true,
        }
    }, 
    {
        timestamps: true
    }
)


export const Assignment = mongoose.model("Assignment", assignmentSchema)