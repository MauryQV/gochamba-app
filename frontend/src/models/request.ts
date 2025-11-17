export type ClientRequest = {
  id: string;
  clienteId: string;
  servicioId: string;
  estado: "PENDIENTE" | "ACEPTADA" | "RECHAZADA" | "COMPLETADA";
  mensaje: string | null;
  fechaSolicitada: string | null;
  creadoEn: string;
  actualizadoEn: string;
  cliente: {
    id: string;
    email: string;
    telefono: string | null;
    perfil: {
      nombreCompleto: string;
      fotoUrl: string;
    };
  };
  servicio: {
    id: string;
    titulo: string;
    precio: number;
    descripcion: string;
  };
};
