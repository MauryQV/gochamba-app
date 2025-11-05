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
  imagenes: string[];
  creadoEn: string;
};
export type ServiceSummary = {
  id: string;
  title: string;
  category: string;
  trabajador: string;

  images: string[];
};
