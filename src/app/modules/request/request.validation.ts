import { z } from "zod";

const createRequestValidation = z.object({
  body: z.object({
    listingId: z.string({
      required_error: "Listing ID is required",
    }),
    tenantId: z.string({
      required_error: "Tenant ID is required",
    }),
    message: z.string({
      required_error: "Message is required",
    }),
  }),
});

const updateRequestStatusValidation = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      required_error: "Status is required",
    }),
    landlordPhone: z.string().optional(),
  }),
});

export const RequestValidation = {
  createRequestValidation, 
  updateRequestStatusValidation, 
};
