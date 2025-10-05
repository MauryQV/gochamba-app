import { Router } from "express";
import { googleAuth } from "../controllers/auth.controller.js";
import { register } from "../services/auth.service.js";

const router = Router();

router.post("/auth/google/", googleAuth);
router.post("/auth/register", register);

export default router;

