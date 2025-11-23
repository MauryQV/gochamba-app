import { useRegister } from "@/app/register/_register-context";
import { adminService } from "@/src/services/admin.service";
import { useCallback, useEffect, useState } from "react";

export type ReportedService = {
  id: string;
  servicioId: string;
  usuarioId: string;
  motivo: string;
  descripcion: string;
  estado: string;
  resueltoEn: string | null;
  resolucion: string | null;
  creadoEn: string;
  actualizadoEn: string;
  servicio: {
    id: string;
    titulo: string;
    descripcion: string;
    precio: number;
    oficioId: string;
    PerfilTrabajador: {
      id: string;
      perfilId: string;
      estaDisponible: boolean;
      creadoEn: string;
      actualizadoEn: string;
      descripcion: string;
      carnetIdentidad: string;
      perfil: {
        nombreCompleto: string;
        fotoUrl: string;
      };
    };
  };
  usuario: {
    id: string;
    email: string;
    perfil: {
      nombreCompleto: string;
      fotoUrl: string;
    };
  };
};

type ReportedServicesResponse = {
  success: boolean;
  items: ReportedService[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
};

export const useReportedServices = () => {
  const { setupData } = useRegister();
  const [reportedServices, setReportedServices] = useState<ReportedService[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportedServices = useCallback(async () => {
    const token = setupData?.token;
    if (!token) {
      setError("No token available");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data: ReportedServicesResponse = await adminService.getReportedServices(token);
      setReportedServices(data.items);
    } catch (err) {
      setError("Error al cargar los servicios reportados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setupData?.token]);

  const unableService = async (reportId: string) => {
    const token = setupData?.token;
    if (!token) {
      return { success: false, error: "No token available" };
    }
    try {
      await adminService.unableService(reportId, token);
      await fetchReportedServices();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Error al inhabilitar el servicio" };
    }
  };

  const desestimateReport = async (reportId: string) => {
    const token = setupData?.token;
    if (!token) {
      return { success: false, error: "No token available" };
    }
    try {
      await adminService.desestimateReport(reportId, token);
      await fetchReportedServices();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Error al desestimar el reporte" };
    }
  };

  useEffect(() => {
    if (setupData?.token) {
      fetchReportedServices();
    }
  }, [setupData?.token, fetchReportedServices]);

  return {
    reportedServices,
    loading,
    error,
    refetch: fetchReportedServices,
    unableService,
    desestimateReport,
  };
};
