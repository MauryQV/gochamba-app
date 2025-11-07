import prisma from "../../config/prismaClient.js";


export const registerWorkerService = async (perfilId, data) => {
  const { descripcion, carnetIdentidad, oficios = [] } = data;

  const existingWorker = await prisma.perfilTrabajador.findUnique({
    where: { perfilId },
  });
  
  if (existingWorker) {
    throw new Error("El usuario ya está registrado como trabajador.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const newWorkerProfile = await tx.perfilTrabajador.create({
      data: {
        perfilId,
        descripcion,
        carnetIdentidad,
      },
    });

    await Promise.all(
      oficios.map((oficioId) =>
        tx.trabajadorOficio.create({
          data: {
            perfilTrabajadorId: newWorkerProfile.id,
            oficioId,
          },
        })
      )
    );
    const existingRole = await tx.usuarioRol.findFirst({
      where: { usuarioId: data.usuarioId, rol: "TRABAJADOR" },
    });
    
    if (!existingRole) {
      await tx.usuarioRol.create({
        data: {
          usuarioId: data.usuarioId,
          rol: "TRABAJADOR",
        },
      });
    }

    return newWorkerProfile;
  });

  return result;
};

export const createPublicationService = async (perfilTrabajadorId, data, imagenesUrls = []) => {
  const { titulo, descripcion, precio, oficioId } = data;

  if (imagenesUrls.length < 1 || imagenesUrls.length > 3) {
    throw new Error("Debes proporcionar entre 1 y 3 URLs de imágenes.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const servicio = await tx.servicio.create({
      data: {
        trabajadorOficioId: `${perfilTrabajadorId}`,
        titulo,
        descripcion,
        precio: parseFloat(precio),
        perfilTrabajadorId,
        oficioId: oficioId
      },
    });

    await tx.imagenServicio.createMany({
      data: imagenesUrls.map((url, index) => ({
        servicioId: servicio.id,
        imagenUrl: url,
        orden: index,
      })),
    });

    return servicio;
  });

  return result;
};


export async function listPublicationsService(
  perfilTrabajadorId,
  { page = 1, pageSize = 10, estado, buscar, order = "desc", oficioId }
) {
  const where = { perfilTrabajadorId };

  if (estado) where.estadoModeracion = estado;
  if (typeof oficioId !== "undefined") where.oficioId = Number(oficioId);

  if (buscar && buscar.trim()) {
    where.OR = [
      { titulo: { contains: buscar, mode: "insensitive" } },
      { descripcion: { contains: buscar, mode: "insensitive" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({
      where,
      orderBy: { creadoEn: order === "asc" ? "asc" : "desc" },
      skip,
      take,
      include: {
        imagenes: true,
        Oficio: {
          select: { id: true, nombre: true },
        },
        PerfilTrabajador: {
          include: {
            perfil: {
              select: {
                nombreCompleto: true,
                fotoUrl: true,
                telefono: true,
              },
            },
          },
        },
      },
    }),
    prisma.servicio.count({ where }),
  ]);

  const formattedItems = items.map((serv) => ({
    id: serv.id,
    titulo: serv.titulo,
    descripcion: serv.descripcion,
    precio: serv.precio,
    oficio: serv.Oficio
      ? { id: serv.Oficio.id, nombre: serv.Oficio.nombre }
      : { id: null, nombre: "Sin oficio" },
    trabajador: serv.PerfilTrabajador?.perfil
      ? {
          nombreCompleto: serv.PerfilTrabajador.perfil.nombreCompleto,
          fotoUrl: serv.PerfilTrabajador.perfil.fotoUrl,
          telefono: serv.PerfilTrabajador.perfil.telefono,
        }
      : { nombreCompleto: "Desconocido", fotoUrl: null, telefono: null },
    imagenes: serv.imagenes
  .sort((a, b) => a.orden - b.orden)
  .map((img) => ({
    id: img.id,
    url: img.imagenUrl,
    orden: img.orden,
  })),
    creadoEn: serv.creadoEn,
    estadoModeracion: serv.estadoModeracion,
  }));

  return {
    items: formattedItems,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      pages: Math.max(1, Math.ceil(total / Number(pageSize))),
    },
  };
}



export const updatePublicationService = async (servicioId, data) => {
  const { titulo, descripcion, precio, oficioId } = data;

  if (!data || Object.keys(data).length === 0) {
    throw new Error("No se enviaron datos para actualizar.");
  }

  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: { perfilTrabajadorId: true }
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  
  const updateData = {
    ...(titulo !== undefined && { titulo }),
    ...(descripcion !== undefined && { descripcion }),
    ...(precio !== undefined && !isNaN(precio) && { precio: parseFloat(precio) }),
    ...(oficioId !== undefined && { oficioId }),
    estadoModeracion: "PENDIENTE"
  };

  if (Object.keys(updateData).length === 1) { // Solo estadoModeracion
    throw new Error("No se enviaron campos válidos para actualizar.");
  }

  const updated = await prisma.servicio.update({
    where: { id: servicioId },
    data: updateData,
  });

  return updated;
};


export const addServiceImagesService = async (perfilTrabajadorId, servicioId, imagenesUrls) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: { perfilTrabajadorId: true }
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado.");

  const currentCount = await prisma.imagenServicio.count({
    where: { servicioId },
  });

  if (currentCount + imagenesUrls.length > 3)
    throw new Error("Máximo 3 imágenes por servicio.");

  await prisma.imagenServicio.createMany({
    data: imagenesUrls.map((url, index) => ({
      servicioId,
      imagenUrl: url,
      orden: currentCount + index,
    })),
  });

  return imagenesUrls;
};


export const deleteServiceImageService = async (perfilTrabajadorId, servicioId, imagenId) => {
  const servicio = await prisma.servicio.findUnique({
    where: { id: servicioId },
    select: {
      perfilTrabajadorId: true,
      imagenes: {
        where: { id: imagenId },
      },
    },
  });

  if (!servicio) throw new Error("Servicio no encontrado.");
  if (servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado.");
  if (servicio.imagenes.length === 0)
    throw new Error("Imagen no encontrada.");

  await prisma.imagenServicio.delete({ where: { id: imagenId } });

  return { success: true,
     imagen_eliminada: imagenId };
};

export async function listSolicitudesRecibidasService(perfilTrabajadorId) {
  const solicitudes = await prisma.solicitudServicio.findMany({
    where: {
      servicio: { perfilTrabajadorId },
    },
    orderBy: { creadoEn: "desc" },
    include: {
      cliente: {
        select: {
          id: true,
          email: true,
          telefono: true,
          perfil: {
            select: {
              nombreCompleto: true,
              fotoUrl: true,
            },
          },
        },
      },
      servicio: {
        select: {
          id: true,
          titulo: true,
          precio: true,
          Oficio: {
            select: { nombre: true },
          },
        },
      },
    },
  });

  return solicitudes.map((sol) => ({
    id: sol.id,
    mensaje: sol.mensaje,
    fechaSolicitada: sol.fechaSolicitada,
    creadoEn: sol.creadoEn,
    estado: sol.estado,
    cliente: {
      id: sol.cliente.id,
      nombreCompleto: sol.cliente.perfil?.nombreCompleto || "Desconocido",
      fotoUrl: sol.cliente.perfil?.fotoUrl || null,
      telefono: sol.cliente.telefono || null,
      email: sol.cliente.email,
    },
    servicio: {
      id: sol.servicio.id,
      titulo: sol.servicio.titulo,
      precio: sol.servicio.precio,
      oficio: sol.servicio.Oficio?.nombre || "Sin oficio",
    },
  }));
}

export async function aceptarSolicitudService(solicitudId, perfilTrabajadorId) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: { servicio: true },
  });

  if (!solicitud) throw new Error("Solicitud no encontrada");
  if (solicitud.servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado para aceptar esta solicitud");

  if (solicitud.estado !== "PENDIENTE")
    throw new Error("Solo se pueden aceptar solicitudes pendientes");

  const updated = await prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "ACEPTADA" },
  });

  return updated;
}

export async function rechazarSolicitudService(solicitudId, perfilTrabajadorId) {
  const solicitud = await prisma.solicitudServicio.findUnique({
    where: { id: solicitudId },
    include: { servicio: true },
  });

  if (!solicitud) throw new Error("Solicitud no encontrada");
  if (solicitud.servicio.perfilTrabajadorId !== perfilTrabajadorId)
    throw new Error("No autorizado para rechazar esta solicitud");

  if (solicitud.estado !== "PENDIENTE")
    throw new Error("Solo se pueden rechazar solicitudes pendientes");

  const updated = await prisma.solicitudServicio.update({
    where: { id: solicitudId },
    data: { estado: "RECHAZADA" },
  });

  return updated;
}
