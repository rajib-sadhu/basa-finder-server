import { Types } from "mongoose";

export interface IListing {
  title: string;
  location: string;
  description: string;
  rent: number;
  bedrooms: number;
  rating?: {
    average: number;
    totalReviews: number;
  };
  images: string[];
  landlordId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  amenities?: string[];
  availability: boolean;
}
