import asyncHandler from "express-async-handler";
import { Brand } from "../../models/Brand/Brand.js";

// @desk create Brand
// @route POST api/v1/brand
// @access Private / Admin

export const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundBrand = await Brand.findOne({ name });
  if (foundBrand) {
    throw new Error("Brand already exist.");
  }

  const brand = await Brand.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "Success",
    message: "Brand created successfully.",
    brand,
  });

});


// @desk get all Brands
// @route GET api/v1/brands
// @access Public

export const getAllBrands = asyncHandler(async (req, res) => {
    
    const brand = await Brand.find();
  
    res.json({
      status: "Success",
      message: "Brands fetched successfully.",
      brand,
    });
  
});


// @desk Single Brand
// @route GET api/v1/brand/:id
// @access Public

export const singleBrand = asyncHandler(async (req, res) => {
    
    const brand = await Brand.findById(req.params.id);
  
    res.json({
      status: "Success",
      message: "Brand fetched successfully.",
      brand,
    });
  
});


// @desk Update Brand
// @route GET api/v1/brands/:id
// @access Public

export const updateBrand = asyncHandler(async (req, res) => {
    const {name}=req.body
    const brand = await Brand.findByIdAndUpdate(req.params.id,{name:name.toLowerCase()},{new:true});
  
    res.json({
      status: "Success",
      message: "Brand Updated successfully.",
      brand,
    });
  
});

// @desk Delete Brand
// @route GET api/v1/brands/:id
// @access Public

export const deletedBrand = asyncHandler(async (req, res) => {
    
   await Brand.findByIdAndDelete(req.params.id);
  
    res.json({
      status: "Success",
      message: "Brand deleted successfully.",
    });
  
});