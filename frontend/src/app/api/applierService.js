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
};
