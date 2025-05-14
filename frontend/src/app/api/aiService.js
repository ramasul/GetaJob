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
};
