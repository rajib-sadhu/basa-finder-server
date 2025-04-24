import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { UserValidation } from "./userValidation";
import { USER_ROLE } from "./user.constants";
import validateRequest from "./../../middleeatres/validateRequest";
import verifyUser from "../../middleeatres/verifyUser";

const userRouter = Router();
userRouter.post(
  "/create-admin",
  validateRequest(UserValidation.userValidationSchema),
  userController.createAdmin
);
userRouter.get("/", userController.getUser);
userRouter.get("/single", verifyUser(), userController.getSingleUser);
userRouter.put("/update/:userId", userController.updateUser);
userRouter.delete("/:userId", userController.deleteUser);
userRouter.patch("/activation/:userId", userController.activationUser);
userRouter.patch("/change-role/:userId", userController.changeUserRole);
userRouter.patch("/update-password/:userId", userController.updatePassword);

export default userRouter;
