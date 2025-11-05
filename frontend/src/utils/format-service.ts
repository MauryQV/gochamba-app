import type { ServiceDb, ServiceSummary } from "../models/service";
export const formatService = (raw: ServiceDb[]): ServiceSummary[] => {
  const servicesFormatted = raw.map((service) => ({
    id: service.id ?? "",
    title: service.titulo ?? "",
    category: service.oficio.nombre,
    trabajador: service?.trabajador?.nombreCompleto ?? "",
    images: service.imagenes ?? [],
  }));

  return servicesFormatted;
};
