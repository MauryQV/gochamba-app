import axios from "axios";
import { BASE_URL } from "../../constants";

const TIMEOUT = 30000;

export const reportService = {
  reportService: async (serviceId: string, motivo: string, descripcion: string, token: string) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/report/${serviceId}/service`,
        {
          motivo,
          descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error reporting service:", error);
      throw error;
    }
  },
};
