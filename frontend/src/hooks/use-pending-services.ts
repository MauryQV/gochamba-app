import { useRegister } from "@/app/register/_register-context";
import type { ServiceSummary } from "@/src/models/service";
import { adminService } from "@/src/services/admin.service";
import { useCallback, useEffect, useState } from "react";

type PendingServiceDb = {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  oficio: {
    id: string;
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

const formatPendingService = (service: PendingServiceDb): ServiceSummary => {
  return {
    id: service.id,
    title: service.titulo,
    description: service.descripcion,
    price: service.precio,
    category: service.oficio.nombre,
    trabajador: service.trabajador.nombreCompleto,
    profile_photo: service.trabajador.fotoUrl,
    images: service.imagenes.map((url, index) => ({
      id: `${service.id}-${index}`,
      imagenUrl: url,
      orden: index,
    })),
    jobId: service.oficio.id,
  };
};

export const usePendingServices = () => {
  const { setupData } = useRegister();
  const [pendingServices, setPendingServices] = useState<ServiceSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingServices = useCallback(async () => {
    const token = setupData?.token;
    if (!token) {
      setError("No token available");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getPendingServices(token);
      const formattedServices = data.map(formatPendingService);
      setPendingServices(formattedServices);
    } catch (err) {
      setError("Error al cargar los servicios pendientes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setupData?.token]);

  const approveService = async (serviceId: string) => {
    const token = setupData?.token;
    if (!token) {
      return { success: false, error: "No token available" };
    }
    try {
      await adminService.approveService(serviceId, token);
      await fetchPendingServices();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Error al aprobar el servicio" };
    }
  };

  const rejectService = async (serviceId: string) => {
    const token = setupData?.token;
    if (!token) {
      return { success: false, error: "No token available" };
    }
    try {
      await adminService.rejectService(serviceId, token);
      await fetchPendingServices();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Error al rechazar el servicio" };
    }
  };

  useEffect(() => {
    if (setupData?.token) {
      fetchPendingServices();
    }
  }, [setupData?.token, fetchPendingServices]);

  return {
    pendingServices,
    loading,
    error,
    refetch: fetchPendingServices,
    approveService,
    rejectService,
  };
};
