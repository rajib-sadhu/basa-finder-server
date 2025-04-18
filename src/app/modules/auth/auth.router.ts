import { Router } from 'express';
import { AuthControllers } from './auth.controller';
import validateRequest from './../../middleeatres/validateRequest';
import { AuthValidation } from './auth.validation';
import { UserValidation } from './../user/userValidation';

const authRouter = Router()

authRouter.post('/register', validateRequest(UserValidation.userValidationSchema), AuthControllers.register);
authRouter.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthControllers.login);

export default authRouter