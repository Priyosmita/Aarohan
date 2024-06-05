import { asyncHandler } from "../utils/asyncHandler.js";

const serverStatus = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .send("<h1>⚙️ Server is running...</h1>")
})

export {serverStatus}