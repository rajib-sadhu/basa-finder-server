import { Schema, model } from 'mongoose';
import { IRequest } from './request.interface';

const requestSchema = new Schema<IRequest>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    landlordPhone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const RentalRequest = model<IRequest>('RentalRequest', requestSchema);
export default RentalRequest;
