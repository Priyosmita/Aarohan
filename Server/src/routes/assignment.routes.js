import { Router } from "express";
import { createAssignment,deleteAssignment,getAllAssignment,giveAssignmentFeedback } from "../controllers/assignment.controller.js";
import { upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";

const router = Router()

// Mentor Routes
router.route("/create-assignment").post(
    verifyJWT,
    isMentor,
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]),
    createAssignment
)

router.route("/delete-assignment").delete(
    verifyJWT,
    isMentor,
    deleteAssignment
)

//common routes
router.route("/get-all-assignments").get(
    verifyJWT,
    getAllAssignment
)

// Student Routes

router.route("/give-assignment-feedback").post(
    verifyJWT,
    isStudent,
    giveAssignmentFeedback
)



export default router