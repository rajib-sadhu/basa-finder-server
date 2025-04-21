import { StatusCodes } from 'http-status-codes';
import { requestService } from './request.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// Tenant: Create a rental request
const createRequest = catchAsync(async (req, res) => {
  const requestData = req.body;
  const result = await requestService.createRequest(requestData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: 'Rental request submitted successfully',
    data: result,
  });
});

// Tenant: Get all requests submitted by the logged-in tenant
const getTenantRequests = catchAsync(async (req, res) => {
  const tenantId = req.body.landlordId || req.user?._id; 
  const result = await requestService.getTenantRequests(tenantId); 
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Rental requests retrieved successfully',
    data: result,
  });
});

// Landlord: Get all requests for listings posted by the landlord
const getRequestsForLandlord = catchAsync(async (req, res) => {
  const landlordId = req.body.landlordId || req.user?._id;
  const result = await requestService.getLandlordRequests(landlordId);  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: 'Rental requests for your listings retrieved successfully',
    data: result,
  });
});

// Landlord: Approve or Reject a rental request
const respondToRequest = catchAsync(async (req, res) => {
  const requestId = req.params.requestId;
  const responsePayload = req.body; // { status: 'approve' | 'reject', phoneNumber?: string }
  const result = await requestService.updateRequestStatus(requestId, responsePayload);  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: `Rental request ${responsePayload.status}ed successfully`,
    data: result,
  });
});

export const requestController = {
  createRequest,
  getTenantRequests,
  getRequestsForLandlord,
  respondToRequest,
};
