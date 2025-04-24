import { Types } from "mongoose";

export interface IRequest {
  listingId: Types.ObjectId; // Reference to the rental listing
  tenantId: Types.ObjectId;
  landlordId: Types.ObjectId;
  name: string;
  rent: number;
  status: "pending" | "approved" | "rejected";
  message?: string;
  paymentStatus?: "unpaid" | "paid";
  landlordPhone?: string; // Provided only if approved
  tenantPhone?: string; // Provided only if approved
  
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
