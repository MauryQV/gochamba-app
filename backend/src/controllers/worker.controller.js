import { registerWorkerService, createPublicationService } from "../services/worker.service.js"

export const registerWorkerController = async (req, res) => {
  try {
    const usuarioId = req.usuarioId; // viene del JWT (middleware de auth)
    const data = req.body;

    const newWorker = await registerWorkerService(usuarioId, data);

    return res.status(201).json({
      message: "Registro de trabajador completado correctamente",
      trabajador: newWorker,
    });
  } catch (error) {
   // console.error("Error al registrar trabajador:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

export const createPublicationController = async (req, res) => {
  try {

    const usuarioId = req.usuarioId;
       // console.log("usuarioId en controller:", usuarioId);
    const data = req.body;
    const imagenes = req.files || [];

    const nuevaPublicacion = await createPublicationService(usuarioId, data, imagenes);

    return res.status(201).json({
      success: true,
      message: "Publicación creada correctamente. Está en revisión.",
      data: nuevaPublicacion,
    });
  } catch (error) {
   // console.error("Error en createPublicationController:", error);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};