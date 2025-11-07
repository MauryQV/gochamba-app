import {
  registerWorkerService,
  createPublicationService,
  listPublicationsService,
  updatePublicationService,
  addServiceImagesService,
  deleteServiceImageService,
  listSolicitudesRecibidasService,
  aceptarSolicitudService,
  rechazarSolicitudService,
} from "../services/worker.service.js";

export const registerWorkerController = async (req, res) => {
  try {
    const { perfilId, id: usuarioId } = req.usuario;
    const data = { ...req.body, usuarioId }; // Necesario para crear el rol
    const newWorker = await registerWorkerService(perfilId, data);
    return res.status(201).json({
      message: "Registro de trabajador completado correctamente",
      trabajador: newWorker,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const createPublicationController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const imagenesUrls = req.body.imagenesUrls || [];

    const nuevaPublicacion = await createPublicationService(
      perfilTrabajadorId,
      req.body,
      imagenesUrls
    );
    return res.status(201).json({
      success: true,
      message: "Publicación creada correctamente. Está en revisión.",
      data: nuevaPublicacion,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export async function listPublicationsController(req, res) {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { page, pageSize, estado, buscar, order, oficioId } = req.query;
    const data = await listPublicationsService(perfilTrabajadorId, {
      page,
      pageSize,
      estado,
      buscar,
      order,
      oficioId,
    });
    return res.json({ success: true, ...data });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      message: err.message || "Error interno",
    });
  }
}

export const updatePublicationController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;
    const updated = await updatePublicationService(id, req.body, perfilTrabajadorId);

    res.status(200).json({ success: true, servicio: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const addServiceImagesController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id } = req.params;
    const imagenesUrls = req.body.imagenesUrls || [];
    if (imagenesUrls.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No se proporcionaron URLs de imágenes",
      });
    }
    const urls = await addServiceImagesService(
      perfilTrabajadorId,
      id,
      imagenesUrls
    );

    res.status(200).json({ success: true, imagenes: urls });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteServiceImageController = async (req, res) => {
  try {
    const { perfilTrabajadorId } = req.usuario;
    const { id, imagenId } = req.params;
    const result = await deleteServiceImageService(
      perfilTrabajadorId,
      id,
      imagenId
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const listarSolicitudesRecibidas = async (req, res) => {
  try {
    const perfilTrabajadorId = req.user.perfilTrabajadorId; // asumiendo autenticación
    const solicitudes = await listSolicitudesRecibidasService(perfilTrabajadorId);
    res.json({ success: true, items: solicitudes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const aceptarSolicitud = async (req, res) => {
  try {
    const perfilTrabajadorId = req.user.perfilTrabajadorId;
    const solicitudId = req.params.id;
    const result = await aceptarSolicitudService(solicitudId, perfilTrabajadorId);
    res.json({ success: true, solicitud: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const perfilTrabajadorId = req.user.perfilTrabajadorId;
    const solicitudId = req.params.id;
    const result = await rechazarSolicitudService(solicitudId, perfilTrabajadorId);
    res.json({ success: true, solicitud: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};