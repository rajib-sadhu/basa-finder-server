import { Router } from "express";
import { listingController } from "./listing.controller";
import { ListingValidation } from "./listing.validation";
import validateRequest from "../../middleeatres/validateRequest";

const listingRouter = Router();

listingRouter.post(
  "/listings",
  validateRequest(ListingValidation.listingValidationSchema),
  listingController.createListing
);

listingRouter.get("/listings", listingController.getListings);
listingRouter.get("/listings/:listingId", listingController.getSingleListing);
listingRouter.put("/listings/:listingId", listingController.updateListing);
listingRouter.delete("/listings/:listingId", listingController.deleteListing);

export default listingRouter;
