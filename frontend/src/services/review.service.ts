import { BASE_URL } from "@/constants";
import axios from "axios";
import type { WorkerReviews } from "../models/review";

const REQUEST_TIMEOUT = 30000;

// Get worker reviews
export const getWorkerReviews = async (userId: string, token: string): Promise<WorkerReviews> => {
  try {
    const response = await axios.get(`${BASE_URL}/review/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: REQUEST_TIMEOUT,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching worker reviews:", error);
    const message =
      error?.response?.data?.error || error?.response?.data?.message || error?.message || "Error al obtener reseñas";
    throw new Error(message);
  }
};
