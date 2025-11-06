import axios from "axios";
import { BASE_URL } from "../../constants";

export const getPublicationsWorker = async (token: string) => {
  return await axios.get(`${BASE_URL}/worker/publications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
