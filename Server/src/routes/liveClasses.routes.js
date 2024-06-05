import { Router } from "express";
import { createLiveClass,
    getAllLiveClasses,
    deleteLiveClass} from "../controllers/liveClasses.controller.js"
import { upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isMentor } from "../middlewares/isMentor.middleware.js";

const router = Router()



router.route("/create-live-class").post(
    verifyJWT,
    isMentor,
    createLiveClass
)

router.route("/delete-live-class").delete(
    verifyJWT,
    isMentor,
    deleteLiveClass
)

//common routes
router.route("/get-all-live-classes").get(
    verifyJWT,
    getAllLiveClasses
)

// Student Routes




export default router