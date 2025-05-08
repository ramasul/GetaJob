import api from "../auth/api";

export const forgotPasswordService = {
  async requestPasswordReset(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyOTP(email, otp) {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async resetPassword(email, otp, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
