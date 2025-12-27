import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// import path from "path";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + path.extname(file.originalname)
//     );
//   },
// });
// export const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { uploadonCloudinary } from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // all files will go into this Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg", "webp", "svg"],
  }
});

const upload = multer({ storage });
export default upload;