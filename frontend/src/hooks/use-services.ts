import { useState, useEffect, useCallback } from "react";
import { servicesService } from "@/src/services/services.service";
import { formatService } from "@/src/utils/format-service";
import type { ServiceSummary } from "@/src/models/service";
import type { CategorySummary } from "@/src/models/category";
import { formatCategory } from "../utils/format-category";

export const useServices = () => {
  const [listServices, setListServices] = useState<ServiceSummary[] | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  const fetchData = useCallback(async () => {
    const data = await servicesService.getServices();
    const categories = await servicesService.getCategories();
    const list = formatService(data.items);
    const listCategories = formatCategory(categories);
    setListServices(list);
    setCategories(listCategories);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { listServices, categories, refetch: fetchData };
};
