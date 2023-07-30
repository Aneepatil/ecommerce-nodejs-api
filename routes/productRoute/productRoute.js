import express from "express";
import { isLogin } from "../../middlewares/isLogin.js";
import { upload } from "./../../configs/fileUpload.js";
import {
  createProductCtrl,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../../controllers/productCtrl/productCtrl.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const productRoutes = express.Router();

productRoutes.post("/", isLogin,isAdmin, upload.array("files"), createProductCtrl);
productRoutes.get("/", getAllProducts);
productRoutes.get("/:id", getSingleProduct);
productRoutes.put("/:id", isLogin,isAdmin, updateProduct);
productRoutes.delete("/:id", isLogin,isAdmin, deleteProduct);


export default productRoutes;
