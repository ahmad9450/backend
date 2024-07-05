import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import User from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId)=>{
  try{
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave : false });
    
    return {accessToken,refreshToken};
  }catch(err){
    throw new ApiError(500,"something went wrong ij generating access token or refresh token");
  }
};

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

const loginUser = asyncHandler(async(req,res)=>{
  const {username,email, password} = req.body;
  if(!username && !email){
    throw new ApiError(404,"username or password incorrect ");
  }
  const user = await User.findOne({
    $or:[{username},{email}]
  });
  if(!user){
    throw new ApiError(409,"user not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid){
    throw new ApiError(400,"Invalid user Credentials ");
  }
  
  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  const options={
    httpOnly : true ,
    secure : true,
  };
  
  return res
  .status(200)
  .cookie("accessToken",accessToken)
  .cookie("refreshToken", refreshToken)
  .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,accessToken, refreshToken,
        },
        "User Logged In Successfully"
        )
    );
});

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,
    {
      refreshToken : undefined,
    },
    {
      new : true,
    }
  );
  
  const options ={
    httpOnly : true,
    secure: true,
  };
  return res
  .status(200)
  .clearCookie("refreshToken",options)
  .clearCookie("accessToken", options)
  .json(new ApiResponse(200,{},"User logged out Successfully "));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
  try{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if(!incomingRefreshToken){
      throw new ApiError(401,"Invalid access token ");
    }
    
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken?._id);
    
    if(!user){
      throw new ApiError(401,"Invalid Refresh Token ");
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Access Token has expired ");
    }
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
    const options={
      httpOnly : true, 
      scure : true 
    };
    
    return res
    .status(200)
    .cookie("accessToekn",accessToken, options)
    .cookie("refreshToken",newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken : newRefreshToken
        },
        "Access Token has refreshed"
        )
      );
    
    
  }catch(error){
    throw new ApiError(409,error?.message || "access token has expired ");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};