import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { stringify } from "flatted";
const registerUser = asyncHandler(async (req, res) => {
  // get user detail  from frontend
  //validation- not empty
  //check if user already exists   -- email username
  //check for images,check for avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in db
  //remove password and refesh token field from response
  // check of user creation
  //return res

  const { fullName, email, userName, password } = req.body;
  console.log("email :", email);
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new APIError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { userName }],
  });
  if (existedUser) {
    throw new APIError(409, "user already exists");
  }
  const avatarLocalPath = req?.files?.avatar?.[0]?.path;

  console.log("Reqfiles", req.files);
  let coverImageLocalPath = null; // Default value for coverImageLocalPath
  if (
    req?.files?.coverImage &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new APIError(400, "Avatar file is required");
  }
  const avatar = avatarLocalPath
    ? await uploadOnCloudinary(avatarLocalPath)
    : null;
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new APIError(400, "Failed to upload on cloudinary");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });
  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .lean();
  console.log("created User", createdUser);
  if (!createdUser) {
    throw new APIError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new Apiresponse(200, createdUser, "user registered successfully"));
});
//   return res
//     .status(201)
//     .json(new Apiresponse(200, createdUser, "user registered successfully"));
// });

export { registerUser };
