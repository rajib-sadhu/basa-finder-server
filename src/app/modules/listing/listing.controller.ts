// listing.controller.ts
import { StatusCodes } from "http-status-codes";
import { listingService } from "./listing.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create a Listing (Landlord only)
const createListing = catchAsync(async (req, res) => {
  const listingData = req.body;
  const result = await listingService.createListing(listingData);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Listing created successfully",
    data: result,
  });
});

// Get All Listings (Public or Admin view)
const getListings = catchAsync(async (req, res) => {
  const result = await listingService.getListings();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Listings retrieved successfully",
    data: result,
  });
});

// Get a Specific Listing by ID
const getSingleListing = catchAsync(async (req, res) => {
  const listingId = req.params.listingId;
  const result = await listingService.getSingleListing(listingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Listing retrieved successfully",
    data: result,
  });
});

const myListings = catchAsync(async (req, res) => {
  const landlordId = req.user?._id;
  const result = await listingService.myListings(landlordId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "My Listing retrieved successfully",
    data: result,
  });
});

// Update a Listing (Landlord only)
const updateListing = catchAsync(async (req, res) => {
  const listingId = req.params.listingId;
  const body = req.body;
  const result = await listingService.updateListing(listingId, body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Listing updated successfully",
    data: result,
  });
});

// Delete a Listing (Landlord or Admin)
const deleteListing = catchAsync(async (req, res) => {
  const listingId = req.params.listingId;
  await listingService.deleteListing(listingId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Listing deleted successfully",
    data: {},
  });
});

export const listingController = {
  createListing,
  getListings,
  getSingleListing,
  updateListing,
  deleteListing,
  myListings,
};
