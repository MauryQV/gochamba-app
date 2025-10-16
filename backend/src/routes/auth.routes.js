import express from "express";
import {
  verifyGoogleAuth,
  completeGoogleRegistration,
  createUserController,
  loginUserController,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/schema/validateSchema.middleware.js";

import { googleVerifySchema, googleCompleteSchema, createUserSchema, loginUserSchema } from "../validations/auth.schema.js";

const router = express.Router();

//verificar el token de Google Oauth
router.post("/google/verify/", validateSchema(googleVerifySchema), verifyGoogleAuth);

//completar el registro de usuario con datos adicionales
router.post("/google/complete/", validateSchema(googleCompleteSchema), completeGoogleRegistration);


router.post("/user/create-user/", validateSchema(createUserSchema), createUserController);


router.post("/user/login/",(validateSchema(loginUserSchema)), loginUserController);


export default router;