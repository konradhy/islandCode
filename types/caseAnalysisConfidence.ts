import { z } from "zod";
export const MetadataConfidenceSchema = z.object({
  case_name: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
  citation: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
  court: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
  parties: z.object({
    plaintiff: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
    defendant: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  }),
  procedural_history: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
});
