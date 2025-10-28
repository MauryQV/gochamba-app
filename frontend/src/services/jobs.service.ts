import { BASE_URL } from "../../constants";
import axios from "axios";
export const getJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/works`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
