import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary once
const cloudName = process.env.CLOUD_NAME;
const apiKey = process.env.CLOUD_API_KEY;
const apiSecret = process.env.CLOUD_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("[Cloudinary] ERROR: Missing credentials!");
  console.error("[Cloudinary] CLOUD_NAME:", cloudName || "MISSING");
  console.error("[Cloudinary] CLOUD_API_KEY:", apiKey ? "SET" : "MISSING");
  console.error(
    "[Cloudinary] CLOUD_API_SECRET:",
    apiSecret ? "SET" : "MISSING"
  );
  console.error(
    "[Cloudinary] Please update your .env file with valid Cloudinary credentials"
  );
} else {
  console.log("[Cloudinary] Configuration loaded successfully");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Helper function to upload images to Cloudinary
export const uploadImagesToCloudinary = async (images) => {
  // Check if Cloudinary is configured
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Please check your .env file."
    );
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new Error("No images provided");
  }

  const uploadPromises = images.map(async (imageData, index) => {
    try {
      console.log(
        `[cloudinary] Uploading image ${index + 1}/${images.length}...`
      );
      const result = await cloudinary.uploader.upload(imageData, {
        folder: "listings",
        transformation: [
          { width: 1000, height: 1000, crop: "limit" },
          { quality: "auto:good" },
        ],
      });
      console.log(`[cloudinary] Image ${index + 1} uploaded successfully`);
      return result.secure_url;
    } catch (error) {
      console.error(`[cloudinary] Upload error for image ${index + 1}:`, {
        message: error.message,
        http_code: error.http_code,
        name: error.name,
      });
      throw new Error(`Failed to upload image ${index + 1}: ${error.message}`);
    }
  });

  return await Promise.all(uploadPromises);
};

export default cloudinary;
