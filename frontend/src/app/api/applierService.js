import api from "@auth/api";
import { cleanEmptyValues } from "@/app/utils/common_fn";

export const applierService = {
  async register(userData) {
    try {
      const cleanedData = cleanEmptyValues(userData);

      const response = await api.post("/appliers", JSON.stringify(cleanedData));

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

  async getAllAppliers(page, applier_per_page) {
    try {
      const skip = (page - 1) * applier_per_page;
      const response = await api.get("/appliers/", {
        params: {
          skip: skip,
          limit: applier_per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching appliers:", error);
      throw error;
    }
  },

  async getApplierByID(applier_id) {
    try {
      const response = await api.get(`/appliers/${applier_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching applier by ID:", error);
      throw error;
    }
  },

  async updateProfile(applier_id, profileData) {
    try {
      const cleanedData = cleanEmptyValues(profileData);
      const response = await api.put(
        `/appliers/${applier_id}`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  //PLIS JANGAN PAKE DELETE INI DULU BELUM DIHANDLE SOALNYA
  async deleteApplier(applier_id) {
    try {
      const response = await api.delete(`/appliers/${applier_id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting applier:", error);
      throw error;
    }
  },

  async updateResume(applier_id, resumeData) {
    try {
      const cleanedData = cleanEmptyValues(resumeData);
      const response = await api.put(
        `/appliers/${applier_id}/update-resume`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error updating resume:", error);
      throw error;
    }
  },

  async deleteResumeComponents(applier_id, component) {
    try {
      const cleanedData = cleanEmptyValues(component);
      const response = await api.put(
        `/appliers/${applier_id}/delete-resume-components`,
        JSON.stringify(cleanedData)
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting resume components:", error);
      throw error;
    }
  },

  async changePassword(applier_id, passwordData) {
    try {
      const response = await api.post(
        `/appliers/${applier_id}/change-password`,
        JSON.stringify(passwordData)
      );
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  async deleteProfilePicture(applier_id) {
    try {
      const response = await api.put(
        `/appliers/${applier_id}/clear-profile-picture`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      throw error;
    }
  },
};
