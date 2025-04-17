import { z } from "zod";

const listingValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    description: z.string({
      required_error: "Description is required",
    }),
    location: z.string({
      required_error: "Location is required",
    }),
    price: z
      .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      })
      .nonnegative("Price must be a positive number"),
    bedrooms: z
      .number({
        required_error: "Bedrooms is required",
        invalid_type_error: "Bedrooms must be a number",
      })
      .min(1, "At least 1 bedroom required"),
    bathrooms: z
      .number({
        required_error: "Bathrooms is required",
        invalid_type_error: "Bathrooms must be a number",
      })
      .min(1, "At least 1 bathroom required"),
    size: z
      .number({
        required_error: "Size is required",
        invalid_type_error: "Size must be a number",
      })
      .min(1, "Size must be a positive number"),
    landlordId: z.string({
      required_error: "Landlord ID is required",
    }),
    amenities: z.array(z.string()).optional(),
    availability: z.boolean(),
  }),
});

export const ListingValidation = {
  listingValidationSchema,
};
