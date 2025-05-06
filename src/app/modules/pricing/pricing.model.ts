// listing.model.ts

import { Schema, model } from "mongoose";
import { IPricing } from "./pricing.interface";

const pricingSchema = new Schema<IPricing>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: "At least one feature is required",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Pricing = model<IPricing>("Pricing", pricingSchema);
export default Pricing;
