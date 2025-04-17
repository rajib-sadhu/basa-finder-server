import { NextFunction, Request, Response, Router } from "express";
 import { userController } from "./user.controller";
 import { UserValidation } from "./userValidation";
//  import auth from './../../middleeatres/auth';
 import { USER_ROLE } from "./user.constants";
 import validateRequest from './../../middleeatres/validateRequest';
 
 const userRouter = Router()
 userRouter.post('/create-admin', validateRequest(UserValidation.userValidationSchema),
     userController.createAdmin)
//  userRouter.get('/', auth(USER_ROLE.admin), userController.getUser)
 userRouter.get('/:userId', userController.getSingleUser)
 userRouter.put('/:userId', userController.updateUser)
 userRouter.delete('/:userId', userController.deleteUser)
 
 export default userRouter