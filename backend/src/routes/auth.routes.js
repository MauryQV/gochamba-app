import { Router } from "express";
import { googleAuth } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/google/", googleAuth);

export default router;
