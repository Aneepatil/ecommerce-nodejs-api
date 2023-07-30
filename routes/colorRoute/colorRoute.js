import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import { createColor, deletedColor, getAllColor, singleColor, updateColor } from "../../controllers/color/colorCtrl.js";
import { isAdmin } from "../../middlewares/isAdmin.js";


const colorRoutes = express.Router();

colorRoutes.post("/", isLogin,isAdmin, createColor);
colorRoutes.get("/", getAllColor);
colorRoutes.get("/:id", singleColor);
colorRoutes.put("/:id", isLogin,isAdmin, updateColor);
colorRoutes.delete("/:id", isLogin,isAdmin, deletedColor);

export default colorRoutes;