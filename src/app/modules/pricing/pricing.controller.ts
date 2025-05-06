import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { pricingService } from "./pricing.service";

// Get All Pricing
const getPricing = catchAsync(async (req, res) => {
  const result = await pricingService.getPricing();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Pricing retrieved successfully",
    data: result,
  });
});

export const pricingController = {
  getPricing,
};
