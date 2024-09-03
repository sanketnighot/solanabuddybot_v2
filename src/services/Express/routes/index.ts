import Router from "express"
import { testBot } from "../controllers/bot.controller"

const router = Router()

router.route("/test").post(testBot)

export default router
