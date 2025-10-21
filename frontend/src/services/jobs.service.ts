import { BASE_URL } from "../../constants";
import axios from "axios";
export const getJobs = async () => {
  try {
    const response = await axios.get(`http://pipexapp.com:8100/api/works`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};
