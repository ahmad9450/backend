import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async(localFilePath)=>{
  try{
    if(!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type : "auto",
    });
    console.log("file has been uploaded on cloudinary ", response.url);
    return response ;
  }catch(err){
    fs.unlinkSync(localFilePath);
    console.log("upload on cloudinary faild ");
    return null;
  }
};

export {uploadOnCloudinary};

    