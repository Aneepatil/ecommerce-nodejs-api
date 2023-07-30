import asyncHandler from "express-async-handler";
import { Category } from "../../models/Category/Category.js";

// @desk create Category
// @route POST api/v1/categories
// @access Private / Admin

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundCategory = await Category.findOne({ name });
  if (foundCategory) {
    throw new Error("Category already exist.");
  }

  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.json({
    status: "Success",
    message: "Category created successfully.",
    category,
  });
});

// @desk get all Category
// @route GET api/v1/categories
// @access Public

export const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Category.find();

  res.json({
    status: "Success",
    message: "Category fetched successfully.",
    category,
  });
});

// @desk Single Category
// @route GET api/v1/categories/:id
// @access Public

export const singleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: "Success",
    message: "Category fetched successfully.",
    category,
  });
});

// @desk Update Category
// @route GET api/v1/categories/:id
// @access Public

export const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: name.toLowerCase() },
    { new: true }
  );

  res.json({
    status: "Success",
    message: "Category Updated successfully.",
    category,
  });
});

// @desk Delete Category
// @route GET api/v1/categories/:id
// @access Public

export const deletedCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    status: "Success",
    message: "Category deleted successfully.",
  });
});
