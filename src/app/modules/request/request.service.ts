
import Request from './request.model';
import Listing from '../listing/listing.model';
import { Types } from 'mongoose';
import { IRequest } from './request.interface';

// Create a new rental request (Tenant)
const createRequest = async (requestData: IRequest): Promise<IRequest> => {
  const result = await Request.create(requestData);
  return result;
};

// Get all requests submitted by a tenant
const getTenantRequests = async (tenantId: string): Promise<IRequest[]> => {
  const result = await Request.find({ tenantId: new Types.ObjectId(tenantId) })
    .populate('listingId')
    .populate('tenantId', 'name email');
  return result;
};

// Get all requests for listings posted by a landlord
const getLandlordRequests = async (landlordId: string): Promise<IRequest[]> => {
  const listings = await Listing.find({ landlordId: new Types.ObjectId(landlordId) });
  const listingIds = listings.map(listing => listing._id);

  const result = await Request.find({ listingId: { $in: listingIds } })
    .populate('listingId')
    .populate('tenantId', 'name email');
  return result;
};

// Update request status (approve/reject) and optionally add landlord phone number
const updateRequestStatus = async (
  requestId: string,
  updateData: Partial<IRequest>
): Promise<IRequest | null> => {
  if (updateData.status === 'approved' && updateData.landlordPhone) {
    updateData.paymentStatus = 'unpaid'; // Automatically set payment status when approved
  }

  const result = await Request.findByIdAndUpdate(requestId, updateData, {
    new: true,
  })
    .populate('listingId')
    .populate('tenantId', 'name email');
  return result;
};

export const requestService = {
  createRequest,
  getTenantRequests,
  getLandlordRequests,
  updateRequestStatus,
};
