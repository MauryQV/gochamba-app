export type AcceptedRequest = {
  id: string;
  clienteId: string;
  servicioId: string;
  estado: "ACEPTADA";
  mensaje: string | null;
  fechaSolicitada: string | null;
  creadoEn: string;
  actualizadoEn: string;
  servicio: {
    id: string;
    trabajadorOficioId: string;
    titulo: string;
    descripcion: string;
    precio: number;
    esActivo: boolean;
    estadoModeracion: string;
    creadoEn: string;
    actualizadoEn: string;
    perfilTrabajadorId: string;
    oficioId: string;
    categoria: string;
    trabajador: {
      nombreCompleto: string;
    };
  };
  cliente: {
    id: string;
    email: string;
    imagenUrl: string;
    password: string;
    esActivo: boolean;
    creadoEn: string;
    es_configurado: boolean;
    actualizadoEn: string;
    telefono: string;
    googleId: string;
    departamento: string;
    tiene_whatsapp: boolean;
  };
};
