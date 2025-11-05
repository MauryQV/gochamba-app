import type { CategoryDb, CategorySummary } from "../models/category";
export const formatCategory = (raw: CategoryDb[]): CategorySummary[] => {
  const categoriesFormatted = raw.map((category) => ({
    id: category.id ?? "",
    name: category.nombre ?? "",
    description: category.descripcion ?? "",
    isActive: category.esActivo ?? false,
  }));

  return categoriesFormatted;
};
