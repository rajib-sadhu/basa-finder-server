import { Router } from "express";
import { pricingController } from "./pricing.controller";

const pricingRouter = Router();

pricingRouter.get("/", pricingController.getPricing);

export default pricingRouter;
