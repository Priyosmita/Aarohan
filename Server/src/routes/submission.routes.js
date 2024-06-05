import { Router } from "express";
import {submitAssignment,
    viewSubmission,
    viewAllSubmissions,
    markSubmission} from "../controllers/submission.controller.js"
import { upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";

const router = Router()

// Mentor Routes


router.route("/view-all-submissions").get(
    verifyJWT,
    isMentor,
    viewAllSubmissions
)

router.route("/mark-submission").put(
    verifyJWT,
    isMentor,
    markSubmission
)


//common routes


// Student Routes

router.route("/submit-assignment").post(
    verifyJWT,
    isStudent,
    upload.fields([
        {
            name: "document",
            maxCount: 1
        }
    ]),
    submitAssignment
)

router.route("/view-submission").get(
    verifyJWT,
    isStudent,
    viewSubmission
)


export default router