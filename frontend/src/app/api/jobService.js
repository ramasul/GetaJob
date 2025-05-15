import api from "@auth/api";
import { cleanEmptyValues } from "@/app/utils/common_fn";

export const jobService = {
  async addJob(jobData) {
    try {
      const cleanedData = cleanEmptyValues(jobData);
      const response = await api.post("/jobs", JSON.stringify(cleanedData));
      return response.data;
    } catch (error) {
      console.error("Error adding job:", error);
      throw error;
    }
  },

  async getAllJobs(page = 1, job_per_page = 20) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get("/jobs/", {
        params: {
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  async getJobByID(job_id) {
    try {
      const response = await api.get(`/jobs/${job_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      throw error;
    }
  },

  async updateJob(job_id, jobData) {
    try {
      const cleanedData = cleanEmptyValues(jobData);
      const response = await api.put(
        `/jobs/${job_id}`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  //PLIS JANGAN PAKE DELETE INI DULU BELUM DIHANDLE SOALNYA
  async deleteJob(job_id) {
    try {
      const response = await api.delete(`/jobs/${job_id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  },

  async getJobByRecruiterID(recruiter_id, page, job_per_page) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get(`/jobs/recruiter/${recruiter_id}`, {
        params: {
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  async getAllJobsWithImage(page = 1, job_per_page = 20) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get("/jobs/image/", {
        params: {
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  async searchJobsWithImage(query = "", page = 1, job_per_page = 20) {
    try {
      const skip = (page - 1) * job_per_page;
      const response = await api.get("/jobs/search/image/", {
        params: {
          query: query,
          skip: skip,
          limit: job_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },
  async countJobs(query = "") {
    try {
      const response = await api.get("/jobs/image/count/", {
        params: {
          query: query,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error counting jobs:", error);
      throw error;
    }
  },

  async countJobsByRecruiterID(recruiter_id) {
    try {
      const response = await api.get(`/jobs/recruiter/${recruiter_id}/count`);
      return response.data;
    } catch (error) {
      console.error("Error counting jobs by recruiter ID:", error);
      throw error;
    }
  },
};
