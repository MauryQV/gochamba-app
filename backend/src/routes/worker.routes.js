import express from "express";
import multer from "multer";
import { createWorkerSchema } from "../validations/worker.schema.js";
import { validateSchema } from "../middlewares/schema/validateSchema.middleware.js";
import { registerWorkerController,createPublicationController } from "../controllers/worker.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js";
const upload = multer({ dest: "uploads/" });

const router  = express.Router();
router.post(
    "/worker/register-worker",
    verifyToken, 
    validateSchema(createWorkerSchema), 
    registerWorkerController
);

router.post(
  "/worker/publication",
  verifyToken,
  upload.array("imagenes", 3),
  createPublicationController
);

export default router;