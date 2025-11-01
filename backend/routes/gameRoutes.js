import express from "express";
import { updateProgress, getLeaderboard } from "../controllers/gameController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.patch("/game/patch/updateprogress", authMiddleware, updateProgress);


router.get("/game/get/leaderboard", authMiddleware, getLeaderboard);

export { router };
