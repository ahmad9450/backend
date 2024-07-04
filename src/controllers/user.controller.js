import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import User from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res,next)=>{
  const {username,email,fullName, password}=req.body;
  console.log(req.body);
  if([username,email,fullName, password].some((field)=> field?.trim() === "")){
    throw new ApiError(400,"User not found");
  }
  const existedUser = await User.findOne({
    $or : [
      {username},{email}
      ]
  });
  if(existedUser){
    throw new ApiError(409,"username or email already taken");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required ");
  }
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  
  if(!avatar){
    throw new ApiError(400,"avatar is required ");
  }
  const user = await User.create({
    username : username.toLowerCase(),
    email,
    password, 
    fullName,
    avatar : avatar?.url,
    coverImage : coverImage?.url || "",
  });
  const createdUser = await User.findOne(user._id).select("-password -refreshToken");
  if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user");
  }
  return res.status(201).json(
    new ApiResponse(200,createdUser,"user Created Successfully")
  );
});

export {registerUser};