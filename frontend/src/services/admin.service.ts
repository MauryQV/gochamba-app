import axios from "axios";
import { BASE_URL } from "./../../constants";

const REQUEST_TIMEOUT = 30000;

export const adminService = {
  async getPendingServices(token: string) {
    const response = await axios.get(`${BASE_URL}/admin/services/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: REQUEST_TIMEOUT,
    });
    return response.data.items;
  },
  async approveService(serviceId: string, token: string) {
    const response = await axios.patch(
      `${BASE_URL}/admin/service/${serviceId}/approve`,
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
  },
  async rejectService(serviceId: string, token: string) {
    const response = await axios.patch(
      `${BASE_URL}/admin/service/${serviceId}/reject`,
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
  },
};
