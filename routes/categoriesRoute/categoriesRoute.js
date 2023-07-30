import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import { createCategory, deletedCategory, getAllCategory, singleCategory, updateCategory } from "../../controllers/categoriesCtrl/categoriesCtrl.js";
import { categoryFileUpload } from "../../configs/categoryUpload.js";
import { isAdmin } from "../../middlewares/isAdmin.js";


const categoryRoutes = express.Router();

categoryRoutes.post("/", isLogin,isAdmin,categoryFileUpload.single('file') ,createCategory);
categoryRoutes.get("/", getAllCategory);
categoryRoutes.get("/:id", singleCategory);
categoryRoutes.put("/:id", isLogin,isAdmin, updateCategory);
categoryRoutes.delete("/:id", isLogin,isAdmin, deletedCategory);

export default categoryRoutes;
