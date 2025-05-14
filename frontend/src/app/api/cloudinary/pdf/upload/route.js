import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const user_type = formData.get("user_type");
    const file = formData.get("file");
    const id = formData.get("id");

    if (!file || !id || !user_type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const params = {
      timestamp,
      folder: `getajob/resumes`,
      public_id: `getajob_resumes_${user_type}_${id}`,
      overwrite: true,
    };

    for (const [key, value] of formData.entries()) {
      if (key !== "id" && key !== "file" && key !== "user_type") {
        params[key] = value;
      }
    }

    const signature = generateSignature(params);
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append("file", file);

    Object.entries(params).forEach(([key, value]) => {
      cloudinaryFormData.append(key, value);
    });

    // Append API key and signature
    cloudinaryFormData.append("api_key", process.env.CLOUDINARY_API_KEY);
    cloudinaryFormData.append("signature", signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload`;
    const response = await axios.post(uploadUrl, cloudinaryFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: error.response?.status || 500 }
    );
  }
}

function generateSignature(params) {
  const paramString = Object.keys(params)
    .sort()
    .map((key) => {
      // Cloudinary expects 'true' and 'false' as strings
      const value =
        typeof params[key] === "boolean" ? params[key].toString() : params[key];
      return `${key}=${value}`;
    })
    .join("&");

  const stringToSign = paramString + process.env.CLOUDINARY_API_SECRET;

  // Create SHA-1 hash
  return crypto.createHash("sha1").update(stringToSign).digest("hex");
}
