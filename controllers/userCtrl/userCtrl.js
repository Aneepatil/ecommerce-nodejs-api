import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { User } from "./../../models/User/User.js";
import { generateToken } from "../../utils/generateToken.js";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader.js";
import { verifyToken } from "../../utils/verifyToken.js";

// @desk Register user
// @route POST api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res, next) => {
  const { fullname, email, password } = req.body;

  // Check user already exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("User Already Existed..");
  }

  // Hash Passwprd
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  res
    .status(200)
    .json({ status: "success", message: "User registered...", data: user });
});

// @desk Login user
// @route POST api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user in DB is exist or not
  const userFound = await User.findOne({ email });

  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    const { password, ...other } = userFound._doc;
    return res.json({
      status: "Success",
      message: "Logged in successfully.",
      data: { ...other, token: generateToken(userFound?._id) },
    });
  } else {
    throw new Error("Invalid Credentials.");
  }
});

// @desk Get user profile
// @route GET api/v1/users/profile
// @access Private

export const getUserProfile = asyncHandler(async (req, res) => {

  // Find the User
  const user = await User.findById(req.userAuthId).populate('orders')
  // console.log(req);
  res.json({
    message: "Welcome to profile page.",
    user
  });
});

// @desk Update Shipping Address
// @route GET api/v1/users/update/shipping
// @access Private

export const updateShippingAddress = asyncHandler(async (req, res) => {
  const {
    firstname,
    lastname,
    address,
    city,
    postalCode,
    province,
    country,
    phone,
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstname,
        lastname,
        address,
        city,
        postalCode,
        province,
        country,
        phone,
      },
      hasShippingAddress: true,
    },
    { new: true }
  );

  // Send the shipping address response
  res.json({
    status:true,
    message: "User shipping address has been updated.",
    user
  });
});
