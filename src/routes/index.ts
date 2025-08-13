import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { PingController } from "../controllers/ping.controller";

const router = Router();

router.use("/auth", authRoutes);
router.use("/ping", new PingController().ping);

export default router;
