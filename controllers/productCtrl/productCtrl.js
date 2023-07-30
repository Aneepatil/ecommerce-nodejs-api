import asyncHandler from "express-async-handler";
import Product from "./../../models/Product/Product.js";
import { Category } from "../../models/Category/Category.js";
import { Brand } from "../../models/Brand/Brand.js";

// @desk Create Product
// @route POST api/v1/products
// @access Private/Admin

export const createProductCtrl = asyncHandler(async (req, res) => {
 
  const convertedImage = req.files.map((file)=>file.path)
  const { name, description, brand, category, sizes, colors, price, totalQty } =
    req.body;

  // Porduct exist
  const productExist = await Product.findOne({ name });
  if (productExist) {
    throw new Error("Product is already exist.");
  }

  // Find the category

  const foundCategory = await Category.findOne({ name: category });

  if (!foundCategory) {
    throw new Error(
      "Category Not Found, please create category first or Check category name."
    );
  }

  // Find the brand
  const foundBrand = await Brand.findOne({ name: brand});
  if (!foundBrand) {
    throw new Error(
      "Brand Not Found, please create brand first or Check brand name."
    );
  }
  // Create Product
  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    images:convertedImage
  });

  //   Push the product into category
  foundCategory.products.push(product._id);

  // save the category
  await foundCategory.save();

  //   Push the product into brand
  foundBrand.products.push(product._id);

  // save the category
  await foundBrand.save();

  res.json({
    status: "Success",
    message: "Product created successfully.",
    product,
  });
});

// @desk Get all Products
// @route GET api/v1/products
// @access Public

export const getAllProducts = asyncHandler(async (req, res) => {
  // Querying products
  let productQuery = Product.find();

  // Filter by product name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  // Filter by brand name
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  // Filter by Category name
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  // Filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  // Filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  // Filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // Product Pagination

  // Page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // Limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // startIndex
  const startIndex = (page - 1) * limit;
  // endIndex
  const endIndex = page * limit;
  // Total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  // Pagination result
  const pagiation = {};
  if (endIndex < total) {
    pagiation.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagiation.prev = {
      page: page - 1,
      limit,
    };
  }

  // await productQuery
  const products = await productQuery.populate("reviews");

  res.json({
    status: "Success",
    total: total,
    results: products.length,
    pagiation,
    message: "Products fetched.",
    products,
  });
});

// @desk Get Single Products
// @route GET api/v1/products/:id
// @access Public

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  if (!product) {
    throw new Error("Product not found.");
  }

  res.json({
    status: "Success",
    message: "Product feteched successfully.",
    product,
  });
});

// @desk Update Products
// @route PUT api/v1/products/:id
// @access Private/Admin

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
    },
    { new: true }
  );

  res.json({
    status: "Success",
    message: "Product Updated successfully.",
    product,
  });
});

// @desk Delete Products
// @route DELETE api/v1/products/:id
// @access Private/Admin

export const deleteProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    status: "Success",
    message: "Product Deleted successfully.",
  });
});
