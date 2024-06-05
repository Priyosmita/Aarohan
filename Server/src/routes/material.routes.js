import { Router } from "express";
import { uploadMaterial,
    deleteMaterial,
    getAllMaterials,
    giveMaterialFeedback
 } from "../controllers/material.controller.js";
import { upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";
import { isClassOwner } from "../middlewares/isClassOwner.middleware.js";
import { isStudent } from "../middlewares/isStudent.middleware.js";

const router = Router()

// Mentor Routes
router.route("/upload-material").post(
    verifyJWT,
    isMentor,
    upload.fields([
        {
            name: "file",
            maxCount: 1
        }
    ]),
    uploadMaterial
)

router.route("/delete-material").delete(
    verifyJWT,
    isMentor,
    deleteMaterial
)

//common routes
router.route("/get-all-materials").get(
    verifyJWT,
    getAllMaterials
)

router.route("/give-material-feedback").post(
    verifyJWT,
    isStudent,
    giveMaterialFeedback
)

// Student Routes




export default router