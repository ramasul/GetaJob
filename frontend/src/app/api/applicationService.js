import api from "@auth/api";
import { cleanEmptyValues } from "@/app/utils/common_fn";

export const applicationService = {
  async addApplication(applicationData) {
    try {
      const cleanedData = cleanEmptyValues(applicationData);
      const response = await api.post(
        `/applications/`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error adding application:", error);
      throw error;
    }
  },

  async getApplicationByID(application_id) {
    try {
      const response = await api.get(`/applications/${application_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching application by ID:", error);
      throw error;
    }
  },

  async getHistoryApplicationCount(applier_id) {
    try {
      const response = await api.get(
        `/applications/applier/${applier_id}/count`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching application history count:", error);
      throw error;
    }
  },

  async getApplierJobCount(job_id) {
    try {
      const response = await api.get(`/applications/job/${job_id}/count`);
      return response.data;
    } catch (error) {
      console.error("Error fetching applier job count:", error);
      throw error;
    }
  },

  async getApplierJobHistory(applier_id, page = 1, job_per_page = 10) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get(`/applications/history/${applier_id}`, {
        params: {
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching applier job history:", error);
      throw error;
    }
  },

  async getJobApplier(job_id, page = 1, job_per_page = 10) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get(`/applications/job/${job_id}/appliers`, {
        params: {
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job applier:", error);
      throw error;
    }
  },
};
