import Coupon from "../../models/Cupon/Cupon.js";
import asyncHandler from "express-async-handler";

// @desk Create Cupon
// @route POST api/v1/cupons
// @access Private

export const createCupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const existCupon = await Coupon.findOne({ code });

  if (existCupon) {
    throw new Error("Cuopon already exist.");
  }

  if (isNaN(discount)) {
    throw new Error("Discount value must be a number.");
  }

  const createdCoupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.json({ message: "Cupon Controller", createdCoupon });
});

// @desk Get All Cupon
// @route GET api/v1/cupons
// @access Private

export const getAllCoupon = asyncHandler(async (req, res) => {
  const allCoupon = await Coupon.find();

  res.json({
    message: "All coupons fetched successfully.",
    allCoupon,
  });
});

// @desk Get Single Cupon
// @route GET api/v1/cupons/:id
// @access Private

export const getSingleCoupon = asyncHandler(async (req, res) => {
  const singleCoupon = await Coupon.findById(req.params.id);

  res.json({
    status:'Success',
    message: "Coupon fetched successfully.",
    singleCoupon,
  });
});

// @desk Update Cupon
// @route GET api/v1/cupons/:id
// @access Private

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const updateCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { code: code?.toUpperCase(), startDate, endDate, discount },
    { new: true }
  );

  res.json({
    status:'Success',
    message: "Coupon updated successfully.",
    updateCoupon,
  });
});

// @desk Delete Cupon
// @route GET api/v1/cupons/:id
// @access Private

export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);

  res.json({
    status:'Success',
    message: "Coupon fetched successfully.",
  });
});
