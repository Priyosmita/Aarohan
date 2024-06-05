import { Router } from "express";
import { createRoadmap, getRoadmap, deleteRoadmap, markDoneRoadmap, markPendingRoadmap, updateMarksRoadmap, generateRoadmap, generateQuestions } from "../controllers/roadmap.controller.js";
import { upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";


const router = Router()


router.route("/create-roadmap").post(
    verifyJWT,
    isStudent,
    createRoadmap
)

router.route("/get-roadmap").get(
    verifyJWT,
    isStudent,
    getRoadmap
)


router.route("/delete-roadmap").delete(
    verifyJWT,
    isStudent,
    deleteRoadmap
)


router.route("/mark-done-roadmap").patch(
    verifyJWT,
    isStudent,
    markDoneRoadmap
)


router.route("/mark-pending-roadmap").patch(
    verifyJWT,
    isStudent,
    markPendingRoadmap
)


router.route("/update-marks-roadmap").patch(
    verifyJWT,
    isStudent,
    updateMarksRoadmap
)

router.route("/generate-roadmap").post(
    verifyJWT,
    isStudent,
    generateRoadmap
)

router.route("/generate-questions").post(
    verifyJWT,
    isStudent,
    generateQuestions
)


export default router;
