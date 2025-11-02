import { registerWorkerService, createPublicationService,listPublicationsService } from "../services/worker.service.js"

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
export async function listPublicationsController(req, res) {
  try {
    const usuarioId = req.usuarioId; // viene del JWT por verifyToken
    const { page, pageSize, estado, buscar, order, oficioId } = req.query;

    const data = await listPublicationsService(usuarioId, {
      page,
      pageSize,
      estado,
      buscar,
      order,
      oficioId,
    });

    return res.json({ ok: true, ...data });
  } catch (err) {
    const status = err.status || 500;
    console.error('listPublicationsController error:', err);
    return res.status(status).json({ ok: false, message: err.message || 'Error interno' });
  }
};