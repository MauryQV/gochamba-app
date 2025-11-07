import { useRegister } from "@/app/register/_register-context";
import type { CategorySummary } from "@/src/models/category";
import type { ServiceSummary } from "@/src/models/service";
import { servicesService } from "@/src/services/services.service";
import { formatService } from "@/src/utils/format-service";
import { useEffect, useState } from "react";
import { getPublicationsWorker } from "../services/publications.service";
import { formatCategory } from "../utils/format-category";
import axios from "axios";
export const usePublicationsWorker = () => {
  const { setupData } = useRegister();
  const [listServices, setListServices] = useState<ServiceSummary[] | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPublicationsWorker(setupData?.token);
        const categories = await servicesService.getCategories();
        const listCategories = formatCategory(categories);
        setCategories(listCategories);
        const list = formatService(response.data.items);
        setListServices(list);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error fetching worker publications:", err.response);
        }
      }
    };
    setupData && fetchData();
  }, []);

  return { listServices, categories };
};
