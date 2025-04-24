import { StatusCodes } from "http-status-codes";
import { requestService } from "./request.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";

const getAllRentals = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.getAllRequests();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "All request fetch successfully",
    data: result,
  });
});
const createRequest = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const payload = req.body;
  // console.log(payload);
  const result = await requestService.createRequest(user, payload);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Request done successfully",
    data: result,
  });
});

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { requestId } = req.body;
  // console.log(requestId);
  const result = await requestService.createPayment(user, requestId, req.ip!);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Payment processed successfully",
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  console.log(req?.query.order_id);
  const request = await requestService.verifyPayment(
    req.query.order_id as string
  );
  console.log(request);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,

    message: "Request verified successfully",
    data: request,
  });
});
// Tenant: Get all requests submitted by the logged-in tenant
const getTenantRequests = catchAsync(async (req, res) => {
  const tenantId = req.body.landlordId || req.user?._id;
  const result = await requestService.getTenantRequests(tenantId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Rental requests retrieved successfully",
    data: result,
  });
});

// Landlord: Get all requests for listings posted by the landlord
const getRequestsForLandlord = catchAsync(async (req, res) => {
  const landlordId = req.body.landlordId || req.user?._id;
  const result = await requestService.getLandlordRequests(landlordId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Rental requests for your listings retrieved successfully",
    data: result,
  });
});

// Landlord: Approve or Reject a rental request
const respondToRequest = catchAsync(async (req, res) => {
  const requestId = req.params.requestId;
  const responsePayload = req.body; // { status: 'approve' | 'reject', phoneNumber?: string }
  const result = await requestService.updateRequestStatus(
    requestId,
    responsePayload
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: `Rental request ${responsePayload.status}ed successfully`,
    data: result,
  });
});

export const requestController = {
  createRequest,
  createPayment,
  getTenantRequests,
  getRequestsForLandlord,
  respondToRequest,
  verifyPayment,
  getAllRentals,
};
