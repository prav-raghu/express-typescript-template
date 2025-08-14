import { Router } from "express";
import { authRoutes } from "./auth.route";
import { pingRoutes } from "./ping.route";

const router = Router();
router.get("/", (req, res) => {
    res.sendFile("index.html", { root: "assets" });
});
router.use("/auth", authRoutes);
router.use("/ping", pingRoutes);

export default router;
