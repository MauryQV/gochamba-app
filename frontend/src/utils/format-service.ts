import type { ServiceDb, ServiceSummary } from "../models/service";
export const formatService = (raw: ServiceDb[]): ServiceSummary[] => {
  const servicesFormatted = raw.map((service) => ({
    id: service?.id ?? "",
    title: service?.titulo ?? "",
    category: service?.oficio?.nombre ?? "",
    description: service?.descripcion ?? "",
    trabajador: service?.trabajador?.nombreCompleto ?? "",
    profile_photo: service?.trabajador?.fotoUrl ?? "",
    images: service?.imagenes ?? [],
  }));

  return servicesFormatted;
};
