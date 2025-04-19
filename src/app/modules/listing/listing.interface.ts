import { Types } from "mongoose";

export interface IListing {
  title: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  images: string[];
  landlordId: Types.ObjectId; // user ID reference
  createdAt?: Date;
  updatedAt?: Date;
  amenities?: string[];
}
