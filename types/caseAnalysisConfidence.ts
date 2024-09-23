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

export const FactualBackgroundConfidenceSchema = z.object({
  key_facts: z.array(
    z.object({
      fact: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
  legal_issues: z.array(
    z.object({
      issue: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
});

export const ArgumentsAndReasoningConfidenceSchema = z.object({
  plaintiff_arguments: z.array(
    z.object({
      argument: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
  defendant_arguments: z.array(
    z.object({
      argument: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
  court_reasoning: z.array(
    z.object({
      reasoning: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
});

export const DecisionAndPrecedentsConfidenceSchema = z.object({
  decision: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
  ratio_decidendi: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string().optional(),
  }),
  key_precedents: z.array(
    z.object({
      case_name: z.string(),
      relevance: z.string(),
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  ),
});
