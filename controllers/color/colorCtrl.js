import asyncHandler from "express-async-handler";
import { Color } from "../../models/Color/Color.js";

// @desk create Color
// @route POST api/v1/colors
// @access Private / Admin

export const createColor = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundColor = await Color.findOne({ name });
  if (foundColor) {
    throw new Error("Color already exist.");
  }

  const color = await Color.create({
    name,
    user: req.userAuthId,
  });

  res.json({
    status: "Success",
    message: "Color created successfully.",
    color,
  });

});


// @desk get all Color
// @route GET api/v1/colors
// @access Public

export const getAllColor = asyncHandler(async (req, res) => {
    
    const color = await Color.find();
  
    res.json({
      status: "Success",
      message: "Color fetched successfully.",
      color,
    });
  
});


// @desk Single Category
// @route GET api/v1/categories/:id
// @access Public

export const singleColor = asyncHandler(async (req, res) => {
    
    const color = await Color.findById(req.params.id);
  
    res.json({
      status: "Success",
      message: "Color fetched successfully.",
      color,
    });
  
});


// @desk Update Category
// @route GET api/v1/categories/:id
// @access Public

export const updateColor = asyncHandler(async (req, res) => {
    const {name}=req.body
    const color = await Color.findByIdAndUpdate(req.params.id,{name:name.toLowerCase(),},{new:true});
  
    res.json({
      status: "Success",
      message: "Color Updated successfully.",
      color,
    });
  
});

// @desk Delete Category
// @route GET api/v1/categories/:id
// @access Public

export const deletedColor = asyncHandler(async (req, res) => {
    
   await Color.findByIdAndDelete(req.params.id);
  
    res.json({
      status: "Success",
      message: "Color deleted successfully.",
    });
  
});