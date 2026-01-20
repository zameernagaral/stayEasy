const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "stayeasy",
    allowed_formats: ["jpeg", "png", "jpg"], // Cloudinary expects snake_case
    resource_type: "image",
  },
});

module.exports = {
  cloudinary,
  storage,
};
