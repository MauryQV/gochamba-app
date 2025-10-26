import express from "express";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

import  { getAllServicesController, crearPublicacionController }  from "../controllers/service.controller.js";

const router = express.Router();

router.get("/works",getAllServicesController);

router.post('/crear-publicacion', upload.array('imagenes', 3), crearPublicacionController );


export default router;