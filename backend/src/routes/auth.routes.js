import express from "express";
import multer from "multer";
import {
  verifyGoogleAuth,
  completeGoogleRegistration,
  createUserController,
  loginUserController,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/schema/validateSchema.middleware.js";
import { googleVerifySchema, googleCompleteSchema, createUserSchema, loginUserSchema } from "../validations/auth.schema.js";
import { uploadImageController } from "../controllers/cloudinary/cloudinary.controller.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

//verificar el token de Google Oauth
router.post("/google/verify/", validateSchema(googleVerifySchema), verifyGoogleAuth);

//completar el registro de usuario con datos adicionales
router.post("/google/complete/", validateSchema(googleCompleteSchema), completeGoogleRegistration);


router.post("/user/create-user/", validateSchema(createUserSchema), createUserController);


router.post("/user/login/",(validateSchema(loginUserSchema)), loginUserController);


router.post("/user/upload-propfile-photo/",upload.single("imagen"), uploadImageController);


export default router;