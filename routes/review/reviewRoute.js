import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import { createReview } from "../../controllers/reviewCtrl/reviewCtrl.js";


const reviewRoutes = express.Router();

reviewRoutes.post("/:productId", isLogin, createReview);

export default reviewRoutes;