import { Router } from "express";
import { getAllComments,createComment  } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";

const router = Router()

// Mentor Routes

router.route("/get-all-comments").get(
    verifyJWT,
    getAllComments
)

router.route("/create-comment").post(
    verifyJWT,
    createComment
)


export default router