import api from "../auth/api";

export const aiService = {
  async getJobRecommendations(applier_id) {
    try {
      const response = await api.get(`/recommendations/applier/${applier_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      throw error;
    }
  },

  async askIsJobSuitable(applier_id, job_id) {
    try {
      const response = await api.get(`/resume/applier/ask`, {
        params: {
          applier_id: applier_id,
          job_id: job_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking job suitability:", error);
      throw error;
    }
  },

  async rateMyResume(applier_id) {
    try {
      const response = await api.get(`/resume/applier/rate`, {
        params: {
          applier_id: applier_id,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error rating resume:", error);
      throw error;
    }
  },

  async parseResume(file) {
    try {
      const response = await api.post(`/resume/parse/pdf_text`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error parsing resume:", error);
      throw error;
    }
  },

  async parseResumeWithOCR(file) {
    try {
      const response = await api.post(`/resume/parse/image_text`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error parsing resume with OCR:", error);
      throw error;
    }
  },
};
