import asyncHandler from "express-async-handler";
import { Review } from "../../models/Review/Review.js";
import Product from "./../../models/Product/Product.js";

// @desk create Review
// @route POST api/v1/reviews
// @access Private / Admin

export const createReview = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;

  // Find the product
  const { productId } = req.params;
  const productFound = await Product.findById(productId).populate('reviews');
  if (!productFound) {
    throw new Error("Product not found");
  }

  // Checking if user already reviewed product

  const hasReviewed = productFound?.reviews?.find((review)=>{
    return review.user.toString() === req?.userAuthId.toString()
  })
  if(hasReviewed){
    throw new Error('You have already reviewed the product.')
  }
  //  Create a review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  // Push review into the product found

  productFound.reviews.push(review?._id);

  // save
  await productFound.save();

  res.json({
    status: "Success",
    message: "Review has been created",
  });
});
