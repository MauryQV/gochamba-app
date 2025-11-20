export type Review = {
  id: string;
  autorId: string;
  objetivoId: string;
  solicitudId: string;
  calificacion: number;
  comentario: string;
  creadoEn: string;
  actualizadoEn: string;
  autor: {
    id: string;
    email: string;
    perfil: {
      nombreCompleto: string;
      fotoUrl: string;
    };
  };
};

export type WorkerReviews = {
  success: boolean;
  total: number;
  data: Review[];
};
