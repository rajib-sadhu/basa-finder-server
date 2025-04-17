// listing.service.ts

import { IListing } from './listing.interface';
import Listing from './listing.model';

// Create a new listing
const createListing = async (listingData: IListing): Promise<IListing> => {
  const result = await Listing.create(listingData);
  return result;
};

// Get all listings
const getListings = async (): Promise<IListing[]> => {
  const result = await Listing.find().populate('landlordId', 'name email phoneNumber');
  return result;
};

// Get a single listing by ID
const getSingleListing = async (id: string): Promise<IListing | null> => {
  const result = await Listing.findById(id).populate('landlordId', 'name email phoneNumber');
  return result;
};

// Update a listing
const updateListing = async (id: string, data: Partial<IListing>): Promise<IListing | null> => {
  data.updatedAt = new Date();
  const result = await Listing.findByIdAndUpdate(id, data, { new: true });
  return result;
};

// Delete a listing
const deleteListing = async (id: string): Promise<IListing | null> => {
  const result = await Listing.findByIdAndDelete(id);
  return result;
};

export const listingService = {
  createListing,
  getListings,
  getSingleListing,
  updateListing,
  deleteListing,
};
