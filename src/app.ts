import cors from 'cors';
import express, { Application, Request, Response } from 'express';

import { globalErrorHandler } from './app/middleeatres/globalErrorHandler';


const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes

const getAController = (req: Request, res: Response) => {
    res.send('Hello World!')
};

app.get('/', getAController)
app.use(globalErrorHandler)

app.use("*", (req: Request, res: Response) =>{
  res.status(404).json({
    status: false,
    message: "Route not found"
  })
})
export default app;