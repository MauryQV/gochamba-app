import { getAllServices, crearPublicacionService } from "../services/service.service.js";

import multer from 'multer';
import path from 'path';

const upload = multer({ dest: 'uploads/' });


  // Crear una publicación (servicio)
  export const  crearPublicacionController = async(req, res) => {
    try {
      const { titulo, descripcion, precio, oficioId } = req.body;
      const usuarioId = req.user.id; // El usuario logueado, que es el trabajador que crea la publicación
      const imagenes = req.files; // Array de archivos de imágenes subidos

      // Llamar al servicio para crear la publicación
      const servicio = await ServicioService.crearPublicacion(
        { titulo, descripcion, precio, oficioId },
        usuarioId,
        imagenes
      );

      return res.json({
        message: 'Publicación creada correctamente',
        servicio,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Hubo un error al crear la publicación' });
    }
  }


export const getAllServicesController = async (req, res) => {
    try{
        const services = await getAllServices();
        return res.json(services);
    }
    catch(error){}
    res.error(500).json({error: "Error al obtener los oficios"});
    }


