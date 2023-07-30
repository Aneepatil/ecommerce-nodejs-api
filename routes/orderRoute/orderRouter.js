import express from "express";
import { createOrder, getAllOrders, getSalesSum, getSingleOrder, updateOrder } from "../../controllers/orderCtrl/orederCtrl.js";
import { isLogin } from "../../middlewares/isLogin.js";


const orderRoutes = express.Router();

orderRoutes.post("/", isLogin, createOrder);
orderRoutes.get("/", isLogin, getAllOrders);
orderRoutes.get("/:id", isLogin, getSingleOrder);
orderRoutes.put("/update/:id", isLogin, updateOrder);
orderRoutes.get("/sales/stats", isLogin, getSalesSum);

export default orderRoutes;