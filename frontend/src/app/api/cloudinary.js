// cloudinary.js
// Direct API integration for Cloudinary without the npm package

import axios from "axios";

export async function uploadImage(file, id, user_type, options = {}) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    formData.append("user_type", user_type);

    Object.entries(options).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
    });

    const response = await axios.post(
      "/api/cloudinary/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

export async function deleteImage(id, user_type) {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("user_type", user_type);

    const response = await axios.post("/api/cloudinary/image/delete", formData);
    return response.data;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

export function getImageUrl(id, transformations = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const publicId = `getajob_profile_images_${id}`;

  let transformationStr = "";
  if (Object.keys(transformations).length > 0) {
    transformationStr =
      Object.entries(transformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(",") + "/";
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationStr}${publicId}`;
}
