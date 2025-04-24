import cors from "cors";
import express, { Application, Request, Response } from "express";

import { globalErrorHandler } from "./app/middleeatres/globalErrorHandler";
import userRouter from "./app/modules/user/user.router";
import listingRouter from "./app/modules/listing/listing.router";
import requestRouter from "./app/modules/request/request.router";
import authRouter from "./app/modules/auth/auth.router";

const app: Application = express();

//  CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:3000",
      "https://basa-finder-psi.vercel.app",
    ],
    credentials: true,
  })
);

//parsers
app.use(express.json());

// application routes
const getAController = (req: Request, res: Response) => {
  res.send("Hello World!");
};
app.get("/", getAController);

// routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use("/api", requestRouter);
app.use(globalErrorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: false,
    message: "Route not found",
  });
});
export default app;
