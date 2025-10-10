import { Router } from "express";
import { register } from "../services/auth.service.js";
import { googleAuth, getUserForSetupController } from "../controllers/auth.controller.js";
const router = Router();

router.post("/auth/google/", googleAuth);
router.post("/auth/register", register);
router.get("/auth/google/user/:userId", getUserForSetupController);

export default router;

