import { Router } from "express";
import { listingController } from "./listing.controller";
import { ListingValidation } from "./listing.validation";
import validateRequest from "../../middleeatres/validateRequest";
import auth from "../../middleeatres/auth";
import { USER_ROLE } from "../user/user.constants";

const listingRouter = Router();

listingRouter.post(
  "/",
  // validateRequest(ListingValidation.listingValidationSchema),
  listingController.createListing
);

listingRouter.get("/", listingController.getListings);
listingRouter.get(
  "/my-listings",
  auth(USER_ROLE.landlord),
  listingController.myListings
);
listingRouter.get("/list/:listingId", listingController.getSingleListing);
listingRouter.put("/update/:listingId", listingController.updateListing);
listingRouter.delete("/delete/:listingId", listingController.deleteListing);

export default listingRouter;
