import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import { globalErrorHandler } from './app/middleeatres/globalErrorHandler';
import userRouter from './app/modules/user/user.router';


const app: Application = express();

//  CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

//parsers
app.use(express.json());

// application routes

const getAController = (req: Request, res: Response) => {
    res.send('Hello World!')
};

app.get('/', getAController)
app.use(globalErrorHandler)
app.use('api/user', userRouter)

app.use("*", (req: Request, res: Response) =>{
  res.status(404).json({
    status: false,
    message: "Route not found"
  })
})
export default app;