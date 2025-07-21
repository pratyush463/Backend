import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
// fs help in reading writting open etc
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log("Uploading file to cloudinary:", localFilePath); // Debugging log
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded

    console.log("file is uploaded on cloudinary", result);
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    console.error("error uploading to cloudinary:", error);
    //remove the locally saved temp file as the upload operation got failed.
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
