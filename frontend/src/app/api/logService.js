import api from "@auth/api";
import { cleanEmptyValues } from "@/app/utils/common_fn";

export const logService = {
  async countJobViews(job_id) {
    try {
      const response = await api.get(`/log-views/job/${job_id}/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job views count:", error);
      throw error;
    }
  },

  async addLogs(jobData) {
    try {
      const cleanedData = cleanEmptyValues(jobData);
      const response = await api.post(
        `/log-views/`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error adding logs:", error);
      throw error;
    }
  },
};
