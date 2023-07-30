import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import { createBrand, deletedBrand, getAllBrands, singleBrand, updateBrand } from "../../controllers/brandCtrl/brandCtrl.js";
import { isAdmin } from "../../middlewares/isAdmin.js";


const brandRoutes = express.Router();

brandRoutes.post("/", isLogin,isAdmin, createBrand);
brandRoutes.get("/", getAllBrands);
brandRoutes.get("/:id", singleBrand);
brandRoutes.put("/:id", isLogin,isAdmin, updateBrand);
brandRoutes.delete("/:id", isLogin,isAdmin, deletedBrand);

export default brandRoutes;