import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const classSchema = new Schema(
    {
        classname: {
            type: String,
            required: true,
            index: true
        },
        thumbnail: {
            type: String, 
            required: true
        },
        title: {
            type: String, 
            required: true,
        },
        description: {
            type: String, 
            required: true
        },
        category: {
            type: String, 
            required: true,
            index: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)

classSchema.plugin(mongooseAggregatePaginate)

export const Class = mongoose.model("Class", classSchema)