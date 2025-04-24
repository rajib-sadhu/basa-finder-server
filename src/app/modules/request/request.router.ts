import { Router } from "express";
import { requestController } from "./request.controller";
import { RequestValidation } from "./request.validation";
import validateRequest from "../../middleeatres/validateRequest";
import auth from "../../middleeatres/auth";
import { USER_ROLE } from "../user/user.constants";

const requestRouter = Router();

// Tenant routes
requestRouter.post(
  "/request",
  auth(USER_ROLE.tenant),
  // validateRequest(RequestValidation.createRequestValidation),
  requestController.createRequest
);

requestRouter.get(
  "/request/all",
  requestController.getAllRentals
);
requestRouter.post(
  "/create-payment",
  auth(USER_ROLE.tenant),
  requestController.createPayment
);
requestRouter.get(
  "/verify",
  auth(USER_ROLE.tenant),
  requestController.verifyPayment
);
requestRouter.get(
  "/tenants/requests",
  auth(USER_ROLE.tenant),
  requestController.getTenantRequests
);

// Landlord routes
requestRouter.get(
  "/landlords/requests",
  auth(USER_ROLE.landlord),
  requestController.getRequestsForLandlord
);

requestRouter.patch(
  "/landlords/requests/:requestId",
  validateRequest(RequestValidation.updateRequestStatusValidation),
  requestController.respondToRequest
);

export default requestRouter;
