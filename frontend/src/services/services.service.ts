import axios from "axios";
import { BASE_URL } from "./../../constants";

export const servicesService = {
  async getServices() {
    const response = await axios.get(`${BASE_URL}/services`);
    return response.data;
  },
  async getCategories() {
    const response = await axios.get(`${BASE_URL}/works`);
    return response.data;
  },
};
