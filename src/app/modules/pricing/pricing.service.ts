import Pricing from "./pricing.model";

const getPricing = async () => {
  const result = await Pricing.find();
  return result;
};

export const pricingService = {
  getPricing,
};
