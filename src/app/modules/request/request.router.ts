import { Router } from 'express';
import { requestController } from './request.controller';
import { RequestValidation } from './request.validation';
import validateRequest from '../../middleeatres/validateRequest';

const requestRouter = Router();

// Tenant routes
requestRouter.post(
  '/tenants/requests',
  validateRequest(RequestValidation.createRequestValidation), 
  requestController.createRequest
);

requestRouter.get(
  '/tenants/requests',
  requestController.getTenantRequests
);

// Landlord routes
requestRouter.get(
  '/landlords/requests',
  requestController.getRequestsForLandlord
);

requestRouter.put(
  '/landlords/requests/:requestId',
  validateRequest(RequestValidation.updateRequestStatusValidation), 
  requestController.respondToRequest
);

export default requestRouter;
