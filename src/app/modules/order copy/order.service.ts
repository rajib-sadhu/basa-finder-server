import mongoose from "mongoose";
// import Product from "../product/product.model";
import Order from "./order.model";
// import User from "../user/user.model";
import { orderUtils } from "./order.utils";
import { IUser } from "../user/user.interface";
import Listing from "../listing/listing.model";


const createOrder = async (
  user: IUser,
  payload: { product: string;},
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { product} = payload;
    const requiredProduct = await Listing.findById(product);
    if (!requiredProduct) {
      throw new Error("Product not found");
    }
    const totalPrice = 1000;

    let order = await Order.create({
      user,
      product: requiredProduct._id,
      totalPrice,
    });
    const updateProduct = await Listing.findByIdAndUpdate(
      product,
      {
        $inc: { availability: false },
      },
      { new: true, session }
    );

    if (!updateProduct) {
      throw new Error("Failed to update product");
    }

    return order

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const createPayment = async (
  user: IUser,
  orderId: string,
  client_ip: string
) => {
  try {
    let order = await Order.findById(orderId)
    console.log(order);
    // payment integration
    const shurjopayPayload = {
      amount: order?.totalPrice,
      order_id: orderId,
      currency: "BDT",
      customer_name: user.name,
      customer_address: "N/A",
      customer_email: user.email,
      customer_phone: "N/A",
      customer_city: "N/A",
      client_ip,
    };

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      if(!order){
        throw new Error('orderis not found')
      }
      order = await order.updateOne(
        {
          transaction: {
            id: payment.sp_order_id,
            transactionStatus: payment.transactionStatus,
          },
        },
      );
    }
    return payment.checkout_url;
  } catch (error) {
    throw error;
  }
};

const getOrder = async () => {
  // const result = await Order.find();

  const result = await Order.aggregate([
    {
      $lookup: {
        from: "users", // The collection name in MongoDB (usually lowercase plural)
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", // Convert the array from lookup to an object
    },
    {
      $lookup: {
        from: "products", // The collection name in MongoDB
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        transaction: 1,
        totalPrice: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        user: {
          _id: "$userDetails._id",
          fullName: "$userDetails.name",
          email: "$userDetails.email",
          isActive: "$userDetails.isActive",
        },
        product: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          image: "$productDetails.image",
        },
      },
    },
  ]);
  return result;
};
const getSingleOrder = async (id: string) => {
  const result = await Order.findById(id);
  return result;
};
const updateStatus = async (orderData: any) => {
  const result = await Order.findOneAndUpdate(
    { _id: orderData.orderId },
    { $set: { status: orderData.status } },
    { new: true }
  );
  return result;
};

const getUserOrder = async (user: IUser) => {
  const result = await Order.aggregate([
    {
      $match: {
        user: user?._id,
      },
    },
    {
      $lookup: {
        from: "users", // The collection name in MongoDB (usually lowercase plural)
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails", // Convert the array from lookup to an object
    },
    {
      $lookup: {
        from: "products", // The collection name in MongoDB
        localField: "product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $project: {
        transaction: 1,
        totalPrice: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        user: {
          _id: "$userDetails._id",
          fullName: "$userDetails.name",
          email: "$userDetails.email",
        },
        product: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          image: "$productDetails.image",
        },
      },
    },
  ]);

  return result;
};

const deleteOrder = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);
  console.log(verifyPayment.length);
  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status == "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status == "Cancel"
            ? "Cancelled"
            : "",
      }
    );
  }

  return verifiedPayment;
};

export const orderService = {
  createOrder,
  getOrder,
  getSingleOrder,
  deleteOrder,
  verifyPayment,
  getUserOrder,
  updateStatus,
  createPayment
};
