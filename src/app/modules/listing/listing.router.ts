import { Router } from "express";
import { listingController } from "./listing.controller";
import { ListingValidation } from "./listing.validation";
import validateRequest from "../../middleeatres/validateRequest";

const listingRouter = Router();

listingRouter.post(
  "/",
  // validateRequest(ListingValidation.listingValidationSchema),
  listingController.createListing
);

listingRouter.get("/", listingController.getListings);
listingRouter.get("/list/:listingId", listingController.getSingleListing);
listingRouter.put("/update/:listingId", listingController.updateListing);
listingRouter.delete("/delete/:listingId", listingController.deleteListing);

export default listingRouter;
