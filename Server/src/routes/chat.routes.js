import { Router } from "express";
import { getChatsWithMentor,getChatsWithStudent,chatWithMentor,chatWithStudent } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";

const router = Router()

// Student Routes

router.route("/get-all-chats-with-mentor").get(
    verifyJWT,
    isStudent,
    getChatsWithMentor
)

router.route("/chat-with-mentor").post(
    verifyJWT,
    isStudent,
    chatWithMentor
)

// Mentor Routes

router.route("/get-all-chats-with-student").get(
    verifyJWT,
    isMentor,
    getChatsWithStudent
)

router.route("/chat-with-student").post(
    verifyJWT,
    isMentor,
    chatWithStudent
)



export default router