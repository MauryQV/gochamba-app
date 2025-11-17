import { BASE_URL } from "@/constants";
import axios from "axios";
import type { ClientRequest } from "../models/request";

const REQUEST_TIMEOUT = 30000;

// Get all client requests for the worker
export const getClientRequests = async (token: string): Promise<ClientRequest[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data.solicitudes || [];
  } catch (error: any) {
    console.error("Error fetching client requests:", error);
    const message =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Error al obtener solicitudes";
    throw new Error(message);
  }
};
// cmhnp03mv0005o501qgjr7dqv
// cmhnp03mv0005o501qgjr7dqv
// Approve a client request
export const approveRequest = async (requestId: string, token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/request/${requestId}/approve`,
      {},
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
    console.error("Error approving request:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al aceptar solicitud";
    throw new Error(message);
  }
};

// Reject a client request
export const rejectRequest = async (requestId: string, token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/request/${requestId}/reject`,
      {},
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
    console.error("Error rejecting request:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al rechazar solicitud";
    throw new Error(message);
  }
};
