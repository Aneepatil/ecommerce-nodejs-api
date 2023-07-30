import express from "express";
import {
  getUserProfile,
  loginUserCtrl,
  registerUserCtrl,
  updateShippingAddress,
} from "../../controllers/userCtrl/userCtrl.js";
import { isLogin } from "../../middlewares/isLogin.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLogin, getUserProfile);
userRoutes.put("/update/shipping", isLogin, updateShippingAddress);

export default userRoutes;
