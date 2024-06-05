import { Router } from "express";
import { serverStatus } from "../controllers/serverStatus.controller.js";

const router = Router()

router.route("/").get(serverStatus)

export default router