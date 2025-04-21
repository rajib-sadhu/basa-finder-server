import Request from "./request.model";
import Listing from "../listing/listing.model";
import { Types } from "mongoose";
import { IRequest } from "./request.interface";

// Create a new rental request (Tenant)
const createRequest = async (requestData: IRequest): Promise<IRequest> => {
  const result = await Request.create(requestData);
  return result;
};

// Get all requests submitted by a tenant
const getTenantRequests = async (tenantId: string): Promise<IRequest[]> => {
  const result = await Request.find({ tenantId: new Types.ObjectId(tenantId) })
    .populate("listingId")
    .populate("tenantId", "name email");
  return result;
};

// Get all requests for listings posted by a landlord
const getLandlordRequests = async (landlordId: string): Promise<IRequest[]> => {
  const requests = await Request.aggregate([
    {
      $match: {
        landlordId: new Types.ObjectId(landlordId),
      },
    },
    {
      $lookup: {
        from: "listings", // collection name in MongoDB (usually lowercase plural of model)
        localField: "listingId",
        foreignField: "_id",
        as: "listingDetails",
      },
    },
    {
      $unwind: "$listingDetails",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        status: 1,
        message: 1,
        tenantId: 1,
        paymentStatus: 1,
        landlordPhone: 1,
        tenantPhone: 1,
        createdAt: 1,
        updatedAt: 1,
        listing: {
          listingId: "$listingDetails._id",
          title: "$listingDetails.title",
          images: "$listingDetails.images",
        },
      },
    },
  ]);

  return requests;
};

// Update request status (approve/reject) and optionally add landlord phone number
const updateRequestStatus = async (
  requestId: string,
  updateData: Partial<IRequest>
): Promise<IRequest | null> => {
  if (updateData.status === "approved" && updateData.landlordPhone) {
    updateData.paymentStatus = "unpaid"; // Automatically set payment status when approved
  }

  const result = await Request.findByIdAndUpdate(requestId, updateData, {
    new: true,
  })
    .populate("listingId")
    .populate("tenantId", "name email");
  return result;
};

export const requestService = {
  createRequest,
  getTenantRequests,
  getLandlordRequests,
  updateRequestStatus,
};
