import prisma from "../../config/prismaClient.js"
import { uploadImageToCloudinary } from "../services/cloudinary/cloudinary.service.js";
import fs from "fs";

export const registerWorkerService = async (usuarioId, data) => {
  const { descripcion, carnetIdentidad, oficios = [] } = data;
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId: usuarioId },
  });
  if (!perfil) throw new Error("El usuario no tiene un perfil válido.");
  const existingWorker = await prisma.perfilTrabajador.findUnique({
    where: { perfilId: perfil.id },
  });
  if (existingWorker) {
    throw new Error("El usuario ya está registrado como trabajador.");
  }
  // Crear perfil de trabajador y sus relaciones dentro de una transaccion
  const result = await prisma.$transaction(async (tx) => {
    // Crear el perfil de trabajador
    const newWorkerProfile = await tx.perfilTrabajador.create({
      data: {
        perfilId: perfil.id,
        descripcion,
        carnetIdentidad,
      },
    });
    // Asociar los oficios seleccionados
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
    // Agregar el rol TRABAJADOR si no lo tiene
    const existingRole = await tx.usuarioRol.findFirst({
      where: { usuarioId: usuarioId, rol: "TRABAJADOR" },
    });
    if (!existingRole) {
      await tx.usuarioRol.create({
        data: {
          usuarioId: usuarioId,
          rol: "TRABAJADOR",
        },
      });
    }
    return newWorkerProfile;
  });
  return result;
};


export const createPublicationService = async (usuarioId, data, imagenes = []) => {
  const { titulo, descripcion, precio, oficioId } = data;
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId },
    include: { perfilTrabajador: true },
  });
  if (!perfil || !perfil.perfilTrabajador) {
    throw new Error("El usuario no tiene un perfil de trabajador activo.");
  }
  const perfilTrabajadorId = perfil.perfilTrabajador.id;
  // Validar cantidad de imágenes
  if (imagenes.length < 1 || imagenes.length > 3) {
    throw new Error("Debes subir entre 1 y 3 imágenes por publicación.");
  }

  // Transacción: crear servicio + imágenes
  const result = await prisma.$transaction(async (tx) => {
    const servicio = await tx.servicio.create({
      data: {
        trabajadorOficioId: `${perfilTrabajadorId}_${oficioId}`, // solo para legibilidad
        titulo,
        descripcion,
        precio: parseFloat(precio),
        perfilTrabajadorId,
        oficioId,
        estadoModeracion: "PENDIENTE",
      },
    });

    // Subir imágenes a Cloudinary
    const urls = [];
    for (let i = 0; i < imagenes.length; i++) {
      const filePath = imagenes[i].path;
      const url = await uploadImageToCloudinary(filePath, "servicios");
      fs.unlinkSync(filePath); // borrar temporal
      urls.push({ imagenUrl: url, orden: i });
    }

    // Guardar URLs en DB
    await tx.imagenServicio.createMany({
      data: urls.map((img) => ({
        servicioId: servicio.id,
        imagenUrl: img.imagenUrl,
        orden: img.orden,
      })),
    });

    return servicio;
  });

  return result;
};
export async function listPublicationsService(
  usuarioId,
  { page = 1, pageSize = 10, estado, buscar, order = 'desc', oficioId }
) {
  // Encontrar el perfilTrabajador del usuario
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId },
    include: { perfilTrabajador: true },
  });
  if (!perfil || !perfil.perfilTrabajador) {
    const e = new Error('El usuario no tiene un perfil de trabajador activo.');
    e.status = 400;
    throw e;
  }
  const perfilTrabajadorId = perfil.perfilTrabajador.id;

  // filtros
  const where = { perfilTrabajadorId };
  if (estado) where.estadoModeracion = estado;             
  if (typeof oficioId !== 'undefined') where.oficioId = Number(oficioId);

  if (buscar && buscar.trim()) {
    where.OR = [
      { titulo: { contains: buscar, mode: 'insensitive' } },
      { descripcion: { contains: buscar, mode: 'insensitive' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const [items, total] = await Promise.all([
    prisma.servicio.findMany({
      where,
      orderBy: { creadoEn: order === 'asc' ? 'asc' : 'desc' },
      skip,
      take,
      include: {
        imagenes: true,        
        PerfilTrabajador: true,
        Oficio: true,         
      },
    }),
    prisma.servicio.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      pages: Math.max(1, Math.ceil(total / Number(pageSize))),
    },
  };
};