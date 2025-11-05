import { useState, useEffect } from "react";
import { servicesService } from "@/src/services/services.service";
import { formatService } from "@/src/utils/format-service";
import type { ServiceSummary } from "@/src/models/service";
import type { CategorySummary } from "@/src/models/category";
import { formatCategory } from "../utils/format-category";
export const useServices = () => {
  const [listServices, setListServices] = useState<ServiceSummary[] | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await servicesService.getServices();
      const categories = await servicesService.getCategories();
      const list = formatService(data.items);
      const listCategories = formatCategory(categories);
      setListServices(list);
      setCategories(listCategories);
    };
    fetchData();
  }, []);

  return { listServices, categories };
};
