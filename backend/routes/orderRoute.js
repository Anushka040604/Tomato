import express from "express";
import { placeOrder, handlePaymentSuccess,userOrders} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.get("/payment-success", handlePaymentSuccess);
orderRouter.get("/userorders",authMiddleware,userOrders);
export default orderRouter;
