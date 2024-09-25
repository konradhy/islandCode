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

export const ImplicationsAndContextConfidenceSchema = z.object({
  immediate_implications: z.array(
    z.object({
      implication: z.string(),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string().optional(),
      }),
    }),
  ),
  long_term_impacts: z.array(
    z.object({
      impact: z.string(),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string().optional(),
      }),
    }),
  ),
  broader_context: z.object({
    context: z.string(),
    assessment: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  }),
});

export const SentencesAndAwardsConfidenceSchema = z.object({
  sentences: z.array(
    z.object({
      sentence: z.object({
        type: z.string(),
        duration: z.string(),
        conditions: z.array(z.string()),
      }),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string().optional(),
      }),
    }),
  ),
  awards: z.array(
    z.object({
      award: z.object({
        type: z.string(),
        amount: z.number(),
        currency: z.string(),
        recipient: z.string(),
      }),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string().optional(),
      }),
    }),
  ),
  other_outcomes: z.array(
    z.object({
      outcome: z.object({
        type: z.string(),
        description: z.string(),
      }),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string().optional(),
      }),
    }),
  ),
  overall: z.object({
    sentences: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
    awards: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
    other_outcomes: z.object({
      confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
      explanation: z.string().optional(),
    }),
  }),
});

export const LegislationAnalysisConfidenceSchema = z.object({
  legislations: z.array(
    z.object({
      legislation: z.object({
        name: z.string(),
        sections_mentioned: z.array(z.string()),
        relation_to_case: z.string(),
        key_snippets: z.array(z.string()),
        explanation: z.string(),
        relevance: z.enum(["High", "Medium", "Low"]),
      }),
      assessment: z.object({
        confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
        explanation: z.string(),
      }),
    }),
  ),
  overall: z.object({
    confidence: z.enum(["High", "Medium", "Low", "Unknown"]),
    explanation: z.string(),
  }),
});
