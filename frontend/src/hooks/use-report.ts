import { useRegister } from "@/app/register/_register-context";
import { reportService } from "@/src/services/report.service";
import { useState } from "react";

export const useReport = () => {
  const { setupData } = useRegister();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (serviceId: string, motivo: string, descripcion: string) => {
    const token = setupData?.token;
    if (!token) {
      setError("No hay token de autenticación");
      return { success: false, error: "No hay token de autenticación" };
    }

    setLoading(true);
    setError(null);

    try {
      await reportService.reportService(serviceId, motivo, descripcion, token);
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al enviar el reporte";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    submitReport,
    loading,
    error,
  };
};
