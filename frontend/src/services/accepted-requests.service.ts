import { BASE_URL } from "@/constants";
import axios from "axios";
import type { AcceptedRequest } from "../models/accepted-request";

const REQUEST_TIMEOUT = 30000;

// Get all accepted requests
export const getAcceptedRequests = async (token: string): Promise<AcceptedRequest[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/request/accepted`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data.solicitudes || [];
  } catch (error: any) {
    console.error("Error fetching accepted requests:", error);
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al obtener solicitudes aceptadas";
    throw new Error(message);
  }
};

// Complete a request with rating
export const completeRequest = async (requestId: string, calificacion: number, comentario: string, token: string) => {
  try {
    await axios.post(
      `${BASE_URL}/request/${requestId}/complete`,
      {
        calificacion,
        comentario,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: REQUEST_TIMEOUT,
      }
    );
    const response = await axios.post(
      `${BASE_URL}/review/${requestId}`,
      {
        calificacion,
        comentario,
      },
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
    console.error("Error completing request:", error);
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al completar solicitud";
    throw new Error(message);
  }
};
