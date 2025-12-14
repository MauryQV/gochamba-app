import { useRegister } from "@/app/register/_register-context";
import type { CategorySummary } from "@/src/models/category";
import type { ServiceSummary } from "@/src/models/service";
import { servicesService } from "@/src/services/services.service";
import { formatService } from "@/src/utils/format-service";
import { useEffect, useState, useCallback } from "react";
import { getPublicationsWorker } from "../services/publications.service";
import { formatCategory } from "../utils/format-category";
import axios from "axios";
export const usePublicationsWorker = () => {
  const { setupData } = useRegister();
  const [listServices, setListServices] = useState<ServiceSummary[] | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!setupData?.token) return;

    try {
      setIsLoading(true);
      const response = await getPublicationsWorker(setupData.token);
      const categories = await servicesService.getCategories();
      const listCategories = formatCategory(categories);
      setCategories(listCategories);
      const list = formatService(response.data.items);
      setListServices(list);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Error fetching worker publications:", err.response);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setupData?.token]);

  const deactivateService = useCallback(
    async (serviceId: string) => {
      if (!setupData?.token) {
        throw new Error("No token available");
      }

      try {
        await servicesService.deactivateService(serviceId, setupData.token);
        // Refetch the list after deactivation
        await fetchData();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error deactivating service:", err.response);
          throw new Error(err.response?.data?.message || "Error al desactivar el servicio");
        }
        throw err;
      }
    },
    [setupData?.token, fetchData]
  );

  useEffect(() => {
    setupData && fetchData();
  }, []);

  return { listServices, categories, isLoading, refetch: fetchData, deactivateService };
};
