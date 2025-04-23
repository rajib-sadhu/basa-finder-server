import mongoose from "mongoose";
import { IUser } from "../user/user.interface"; //

export interface IOrder {
    user : mongoose.Schema.Types.ObjectId
    product : mongoose.Schema.Types.ObjectId
    status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
    totalPrice? : number
    payment:{

    }
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

