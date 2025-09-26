// lib/uploadToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @param {string} file 
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export async function uploadToCloudinary(file,name) {
  const result = await cloudinary.uploader.upload(file, {
    folder: name,
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}
