import { BASE_URL } from "@/constants";
import axios from "axios";

const REQUEST_TIMEOUT = 30000;

// Upload service images to get URLs
export const uploadServiceImages = async (formData: FormData, token: string): Promise<string[]> => {
  try {
    const response = await axios.post(`${BASE_URL}/worker/upload-service-images`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data.urls;
  } catch (error: any) {
    console.error("Error uploading images:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al subir imágenes";
    throw new Error(message);
  }
};

// Create publication with data (including imagenesUrls)
export const createPublication = async (data: any, token: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/worker/publication`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data.urls;
  } catch (error: any) {
    console.error("Error creating publication:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al crear publicación";
    throw new Error(message);
  }
};

// Update service data
export const updateService = async (serviceId: string, data: any, token: string) => {
  try {
    const response = await axios.patch(`${BASE_URL}/services/${serviceId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error updating service:", error);
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar servicio";
    throw new Error(message);
  }
};

// Add images to existing service
export const addServiceImages = async (serviceId: string, imagenesUrls: string[], token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/worker/service/${serviceId}/images`,
      { imagenesUrls },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: REQUEST_TIMEOUT,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error adding service images:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al agregar imágenes";
    throw new Error(message);
  }
};

// Delete service image
export const deleteServiceImage = async (serviceId: string, imageId: string, token: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/services/${serviceId}/images/${imageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error deleting service image:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al eliminar imagen";
    throw new Error(message);
  }
};
