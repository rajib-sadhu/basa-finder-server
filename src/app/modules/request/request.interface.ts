import { Types } from "mongoose";

export interface IRequest {
  listingId: Types.ObjectId;   // Reference to the rental listing
  tenantId: Types.ObjectId;    
  status: 'pending' | 'approved' | 'rejected'; 
  message?: string;         
  paymentStatus?: 'unpaid' | 'paid'; 
  landlordPhone?: string;      // Provided only if approved
  createdAt?: Date;
  updatedAt?: Date;
}
