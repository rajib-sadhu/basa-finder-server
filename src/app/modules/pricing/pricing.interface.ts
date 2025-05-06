import { Types } from "mongoose";

export interface IPricing {
  title: string;
  price: number;
  description: string;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
