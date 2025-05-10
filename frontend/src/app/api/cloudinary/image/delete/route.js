import { NextResponse } from "next/server";
import crypto from "crypto";
import axios from "axios";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const user_type = formData.get("user_type");

    if (!id || !user_type) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const folder = `getajob/profile_images`;
    const publicId = `${folder}/getajob_profile_images_${user_type}_${id}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = generateSignature({
      public_id: publicId,
      timestamp,
    });

    const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`;

    const response = await axios.post(
      url,
      {
        public_id: publicId,
        timestamp,
        signature,
        folder: folder,
        api_key: process.env.CLOUDINARY_API_KEY,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: error.response?.status || 500 }
    );
  }
}

function generateSignature(params) {
  const paramString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = paramString + process.env.CLOUDINARY_API_SECRET;

  // Create SHA-1 hash
  return crypto.createHash("sha1").update(stringToSign).digest("hex");
}
