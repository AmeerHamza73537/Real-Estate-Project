import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadonCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath) return null;

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });

    // Remove local temp file
    fs.unlinkSync(localfilePath);

    return response;

  } catch (error) {
    fs.unlinkSync(localfilePath); // delete failed file
    return null;
  }
};
