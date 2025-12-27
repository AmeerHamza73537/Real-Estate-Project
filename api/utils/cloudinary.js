import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadonCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;

    console.log('[cloudinary] uploading', localfilePath);
    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
      folder: "listings", // 📁 Organize uploads
      transformation: [
        { width: 1000, height: 1000, crop: "limit" }, // 🖼️ Limit size
        { quality: "auto:good" } // 📉 Optimize quality
      ]
    });

    // Remove local temp file
    if (fs.existsSync(localfilePath)) {
      fs.unlinkSync(localfilePath);
    }

    console.log('[cloudinary] upload success', response?.secure_url);
    return response;

  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(localfilePath)) {
      try { fs.unlinkSync(localfilePath); } catch(e) {}
    }
    console.error('[cloudinary] upload error', error?.message || error);
    return null;
  }
};
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("API_KEY:", process.env.CLOUD_API_KEY ? "ok" : "missing");
console.log("API_SECRET:", process.env.CLOUD_API_SECRET ? "ok" : "missing");
