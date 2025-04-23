import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "./../../middleeatres/auth";
import { USER_ROLE } from "../user/user.constants";

const orderRouter = Router();

orderRouter.post(
  "/create-order",
  auth(USER_ROLE.tenant),
  orderController.createOrder
);
orderRouter.post(
  "/create-payment",
  auth(USER_ROLE.tenant),
  orderController.createPayment
);
orderRouter.get(
  "/verify",
  auth(USER_ROLE.tenant),
  orderController.verifyPayment
);
orderRouter.get("/", orderController.getOrder);
orderRouter.get("/:orderId", orderController.getSingleOrder);

orderRouter.patch('/update-status', orderController.updateStatus)

orderRouter.delete("/:orderId", orderController.deleteOrder);
orderRouter.get(
  "/user/orders",
  auth(USER_ROLE.tenant),
  orderController.getUserOrder
);

export default orderRouter;
