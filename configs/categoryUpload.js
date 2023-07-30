import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,

});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png", "jpeg"],
  params: {
    folder: "E-commerce-api",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

// Init multer storage Engine

export const categoryFileUpload = multer({ storage });
