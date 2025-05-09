import api from "../auth/api";
import { cleanEmptyValues } from "@/app/utils/common_fn";

export const recruiterService = {
  async register(userData) {
    try {
      const cleanedData = cleanEmptyValues(userData);

      const response = await api.post(
        "/recruiters",
        JSON.stringify(cleanedData)
      );

      if (response.status === 201) {
        return await response.data;
      }

      let errorData;
      try {
        errorData = await response.data;
      } catch (e) {
        errorData = { detail: response.statusText };
      }

      if (response.status === 400) {
        throw new Error(
          JSON.stringify({
            type: "BAD_REQUEST",
            message:
              "Something went wrong, maybe try changing your username or email",
            details: errorData.detail || null,
          })
        );
      }

      if (response.status === 422) {
        throw new Error(
          JSON.stringify({
            type: "VALIDATION_ERROR",
            message: "Please fix the following errors:",
            details: errorData.detail || errorData,
          })
        );
      }

      throw new Error(
        JSON.stringify({
          type: "OTHER_ERROR",
          message:
            errorData.detail ||
            `Registration failed with status: ${response.status}`,
          details: null,
        })
      );
    } catch (error) {
      console.error("Registration error:", error);

      if (error.message && error.message.startsWith("{")) {
        throw error;
      } else if (error.response && error.response.status) {
        const status = error.response.status;
        const data = error.response.data || {};

        if (status === 400) {
          throw new Error(
            JSON.stringify({
              type: "BAD_REQUEST",
              message:
                "Something went wrong, maybe try changing your username or email",
              details: data.detail || null,
            })
          );
        } else if (status === 422) {
          throw new Error(
            JSON.stringify({
              type: "VALIDATION_ERROR",
              message: "Please fix the following errors:",
              details: data.detail || data,
            })
          );
        } else {
          throw new Error(
            JSON.stringify({
              type: "OTHER_ERROR",
              message:
                data.detail || `Registration failed with status: ${status}`,
              details: null,
            })
          );
        }
      } else {
        throw new Error(
          JSON.stringify({
            type: "UNEXPECTED_ERROR",
            message: error.message || "An unexpected error occurred",
            details: null,
          })
        );
      }
    }
  },

  async getAllRecruiters(page, recruiter_per_page) {
    try {
      skip = (page - 1) * recruiter_per_page;
      const response = await api.get("/recruiters/", {
        params: {
          skip: skip,
          limit: recruiter_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching appliers:", error);
      throw error;
    }
  },

  async getRecruiterByID(recruiter_id) {
    try {
      const response = await api.get(`/recruiters/${recruiter_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recruiter by ID:", error);
      throw error;
    }
  },

  async updateProfile(recruiter_id, profileData) {
    try {
      const cleanedData = cleanEmptyValues(profileData);
      const response = await api.put(
        `/recruiters/${recruiter_id}`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  //PLIS JANGAN PAKE DELETE INI DULU BELUM DIHANDLE SOALNYA
  async deleteRecruiter(recruiter_id) {
    try {
      const response = await api.delete(`/recruiters/${recruiter_id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting recruiter:", error);
      throw error;
    }
  },

  async changePassword(recruiter_id, passwordData) {
    try {
      const response = await api.post(
        `/recruiters/${recruiter_id}/change-password`,
        JSON.stringify(passwordData)
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};
