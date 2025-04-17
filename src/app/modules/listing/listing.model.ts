// listing.model.ts

import { Schema, model } from 'mongoose';
import { IListing } from './listing.interface';

const listingSchema = new Schema<IListing>(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 1,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: 'At least one image is required',
      },
    },
    landlordId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Listing = model<IListing>('Listing', listingSchema);
export default Listing;
