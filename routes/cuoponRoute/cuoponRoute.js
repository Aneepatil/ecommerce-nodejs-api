import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import {
  createCupon,
  deleteCoupon,
  getAllCoupon,
  getSingleCoupon,
  updateCoupon,
} from "../../controllers/cuopon/cuoponCtrl.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const cuponRoutes = express.Router();

cuponRoutes.post("/", isLogin,isAdmin, createCupon);
cuponRoutes.get("/", getAllCoupon);
cuponRoutes.get("/:id", getSingleCoupon);
cuponRoutes.put("/update/:id", isLogin,isAdmin, updateCoupon);
cuponRoutes.delete("/delete/:id", isLogin,isAdmin, deleteCoupon);

export default cuponRoutes;
