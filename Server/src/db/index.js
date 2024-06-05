import mongoose from "mongoose";


const DB_NAME = "aarohan"
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log("Database Connected Successfully !!");
    } catch (error) {
        console.log("Database connection failed !! ", error);
        process.exit(1)
    }
}

export default connectDB