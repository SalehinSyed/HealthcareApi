import { z } from "zod";

const chronicDetailsSchema = z.object({
  detail: z.string().trim().optional(),
  medication: z.string().trim().optional(),
});

export const questionnaireSchema = z.object({
  name: z.string().trim(),
  age: z.number().int().nonnegative(),
  gender: z.string().trim(),
  health_condition: z.string().trim(),
  symptoms_present: z.boolean(),
  symptoms_list: z.string().trim().optional(),
  chronicDetails: chronicDetailsSchema.optional(),
});
