import { z } from "zod";

export const CarrierValidationSchema = z.object({
  carrier_name: z.string({ required_error: "Carrier name is required" }),
  phone: z.string({ required_error: "Phone number is required", invalid_type_error: "Please enter a valid phone number" }),
});
