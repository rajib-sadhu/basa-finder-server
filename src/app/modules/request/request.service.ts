import Request from "./request.model";
import Listing from "../listing/listing.model";
import mongoose, { Types } from "mongoose";
import { IRequest } from "./request.interface";
import { IUser } from "../user/user.interface";
import { requestUtils } from "./request.utils";
import User from "../user/user.model";
import { EmailSender } from "../../utils/sendEmail";

// Create a new rental request (Tenant)
const getAllRequests = async (): Promise<IRequest[]> => {
  const result = await Request.find();
  return result;
};
const createRequest = async (
  user: IUser,
  payload: { listingId: string; message: string }
) => {
  console.log(user);
  const session = await mongoose.startSession();
  session.startTransaction();
  const { listingId, message } = payload;

  try {
    const requiredListing = await Listing.findById(listingId);
    const requiredLandlord = await User.findById(requiredListing?.landlordId);
    if (!requiredListing) {
      throw new Error("Listing not found");
    }
    if (!requiredLandlord) {
      throw new Error("Landlord not found");
    }

    let order = await Request.create({
      listingId: listingId,
      tenantId: user?._id,
      landlordId: requiredListing?.landlordId,
      rent: requiredListing?.rent,
      status: "pending",
      message: message,
      name: user?.name,
      email: user?.email,
      landlordPhone: requiredLandlord?.phoneNumber,
      tenantPhone: user?.phoneNumber,
      // totalPrice,
    });
    // const updateLisnting = await Listing.findByIdAndUpdate(
    //   {
    //     $inc: { availability: false },
    //   },
    //   { new: true, session }
    // );

    // if (!updateLisnting) {
    //   throw new Error("Failed to update product");
    // }
    EmailSender(
      requiredLandlord.email,
      "Rental Request",
      `You have an request for your rental. Listing id:${listingId}. \n Visit the side now - https://basa-finder-psi.vercel.app/ \n \nFrom,\nSupport - BasaFinder`
    );
    return order;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};
const createPayment = async (
  user: IUser,
  requestId: string,
  client_ip: string
) => {
  try {
    let request = await Request.findById(requestId).populate("listingId");

    const shurjopayPayload = {
      amount: request?.rent,
      order_id: requestId,
      currency: "BDT",
      customer_name: user.name,
      customer_address: "N/A",
      customer_email: user.email,
      customer_phone: "N/A",
      customer_city: "N/A",
      client_ip,
    };

    const payment = await requestUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      if (!request) {
        throw new Error("request not found");
      }
      request = await request.updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }
    return payment.checkout_url;
  } catch (error) {
    throw error;
  }
};
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await requestUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Request.findOneAndUpdate(
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
        paymentStatus:
          verifiedPayment[0].bank_status == "Success"
            ? "paid"
            : verifiedPayment[0].bank_status == "failed"
            ? "Pending"
            : verifiedPayment[0].bank_status == "cancel"
            ? "Cancelled"
            : "",
      }
    );
  }

  return verifiedPayment;
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

type IRequestWithPopulatedTenant = IRequest & {
  tenantId: {
    name: string;
    email: string;
  };
  listingId: {
    _id: string;
  };
};
// Update request status (approve/reject) and optionally add landlord phone number
const updateRequestStatus = async (
  requestId: string,
  updateData: Partial<IRequest>
): Promise<IRequestWithPopulatedTenant | null> => {
  if (updateData.status === "approved" && updateData.landlordPhone) {
    updateData.paymentStatus = "unpaid";
  }

  const result = (await Request.findByIdAndUpdate(requestId, updateData, {
    new: true,
  })
    .populate("listingId", "_id")
    .populate("tenantId", "name email")) as IRequestWithPopulatedTenant | null;

  if (result?.tenantId?.email && result?.listingId?._id) {
    EmailSender(
      result.tenantId.email,
      `Rental ${updateData.status}`,
      `Your Rental request is ${updateData.status}. Listing id:${result.listingId._id}. \n Visit the site now - https://basa-finder-psi.vercel.app/ \n \nFrom,\nSupport - BasaFinder`
    );
  }

  return result;
};

export const requestService = {
  createRequest,
  createPayment,
  getTenantRequests,
  getLandlordRequests,
  updateRequestStatus,
  verifyPayment,
  getAllRequests
};
