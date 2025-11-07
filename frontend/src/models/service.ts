export type ServiceDb = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  oficio: {
    id: string | null;
    nombre: string;
  };
  trabajador: {
    nombreCompleto: string;
    fotoUrl: string;
    telefono: string;
  };
  imagenes: { id: string; imagenUrl: string; orden: number }[];
  creadoEn: string;
};
export type ServiceSummary = {
  id: string;
  title: string;
  category: string;
  trabajador: string;
  profile_photo: string;
  images: { id: string; imagenUrl: string; orden: number }[];
  description: string;
  price?: number;
  jobId?: string;
};
