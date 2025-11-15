import express from "express"
import {
    getReseñasPerfilController,
    crearReseñaController
} from "../controllers/review.controller.js"
const router = express.Router();

router.get("/", getReseñasPerfilController);

router.post("/", crearReseñaController);

export default router;