import { z } from "zod";

/**
 * Schema for the chronic details
 * It includes optional 'detail' and 'medication' fields, both of which are trimmed strings
 */
const chronicDetailsSchema = z.object({
  /**
   * Detail of the chronic illness, optional field
   */
  detail: z.string().trim().optional(),

  /**
   * Medication for the chronic illness, optional field
   */
  medication: z.string().trim().optional(),
});

/**
 * Schema for a questionnaire
 * It includes 'name', 'age', 'gender', 'health_condition', and 'symptoms_present' fields
 * It also includes optional 'symptoms_list' and 'chronicDetails' fields
 * The 'chronicDetails' field uses the 'chronicDetailsSchema' defined above
 */
export const questionnaireSchema = z.object({
  /**
   * Name of the person filling the questionnaire
   */
  name: z.string().trim(),

  /**
   * Age of the person, should be a non-negative integer
   */
  age: z.number().int().nonnegative(),

  /**
   * Gender of the person
   */
  gender: z.string().trim(),

  /**
   * Health condition of the person
   */
  health_condition: z.string().trim(),

  /**
   * Whether the person has any symptoms
   */
  symptoms_present: z.boolean(),

  /**
   * List of symptoms if any, optional field
   */
  symptoms_list: z.string().trim().optional(),

  /**
   * Chronic illness details if any, optional field
   */
  chronicDetails: chronicDetailsSchema.optional(),
});
