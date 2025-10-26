import prisma from "../../config/prismaClient.js";

export const getAllServices = async () => {
    return await prisma.oficio.findMany();

}

export const crearPublicacionService = async(data, usuarioId, imagenes)  => {
    try {
      // Crear el servicio en la base de datos
      const servicio = await prisma.servicio.create({
        data: {
          titulo: data.titulo,
          descripcion: data.descripcion,
          precio: parseFloat(data.precio),
          estadoModeracion: 'PENDIENTE', // Inicialmente en estado pendiente
          oficioId: data.oficioId,
          perfilTrabajadorId: usuarioId, // El trabajador debe ser el usuario que está creando el servicio
        },
      });

      // Subir las imágenes si existen
      if (imagenes && imagenes.length > 0) {
        for (let i = 0; i < imagenes.length; i++) {
          await prisma.imagenServicio.create({
            data: {
              servicioId: servicio.id,
              imagenUrl: imagenes[i].path, // Aquí asumimos que las imágenes están almacenadas y tenemos su URL
              orden: i,
            },
          });
        }
      }

      return servicio;
    } catch (error) {
      //console.error('Error al crear el servicio:', error);
      throw new Error('No se pudo crear el servicio');
    }
  }