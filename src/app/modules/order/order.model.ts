import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { IRequest } from "../request/request.interface";


const orderSchema = new Schema<IRequest>({
    
        listingId: {
          type: Schema.Types.ObjectId,
          ref: "Listing",
          required: true,
        },
        tenantId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        landlordId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
    
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        message: {
          type: String,
        },
        paymentStatus: {
          type: String,
          enum: ["unpaid", "paid"],
          default: "unpaid",
        },
        landlordPhone: {
          type: String,
        },
        tenantPhone: {
          type: String,
        },
      },
      {
        timestamps: true,
      })

const Order = model<IRequest>('order', orderSchema)

export default Order


