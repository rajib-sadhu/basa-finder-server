import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";


const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
      },
}, {
    timestamps: true
})

const Order = model<IOrder>('order', orderSchema)

export default Order


