import express from "express";
import {
  verifyGoogleAuth,
  completeGoogleRegistration,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";

import { googleVerifySchema, googleCompleteSchema } from "../validations/auth.schema.js";
import { prefillByUserId } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/google/verify/", validateSchema(googleVerifySchema), verifyGoogleAuth);

router.post("/google/complete/", validateSchema(googleCompleteSchema), completeGoogleRegistration);

router.get('/auth/google/user/:userId', prefillByUserId);

export default router;