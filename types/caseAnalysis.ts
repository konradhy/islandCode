import { z } from "zod";

export const MetadataSchema = z.object({
  case_name: z.string(),
  citation: z.string(),
  court: z.string(),
  parties: z.object({
    plaintiff: z.string(),
    defendant: z.string(),
  }),
  procedural_history: z.array(z.string()),
});

export const LegislationAnalysisSchema = z.object({
  legislations: z.array(
    z.object({
      name: z.string(),
      sections_mentioned: z.array(z.string()),
      relation_to_case: z.string(),
      key_snippets: z.array(z.string()),
      explanation: z.string(),
      relevance: z.string(),
    }),
  ),
});

export const KeyPersonSchema = z.object({
  persons: z.array(
    z.object({
      name: z.string(),
      role: z.string(),
      relationships: z.array(
        z.object({
          related_to: z.string(),
          relationship: z.string(),
        }),
      ),
      significant_actions_or_statements: z.array(z.string()),
    }),
  ),
});

export const FinalSummarySchema = z.object({
  summary: z.string(),
});

export const FactualBackgroundSchema = z.object({
  key_facts: z.array(z.string()),
  legal_issues: z.array(z.string()),
});

export const ArgumentsAndReasoningSchema = z.object({
  plaintiff_arguments: z.array(z.string()),
  defendant_arguments: z.array(z.string()),
  court_reasoning: z.array(z.string()),
});

export const DecisionAndPrecedentsSchema = z.object({
  decision: z.string(),
  ratio_decidendi: z.string(),
  key_precedents: z.array(
    z.object({
      case_name: z.string(),
      relevance: z.string(),
      quote: z.string(),
      principle: z.string(),
      context: z.string(),
    }),
  ),
});

export const ImplicationsAndContextSchema = z.object({
  immediate_implications: z.array(z.string()),
  long_term_impacts: z.array(z.string()),
  broader_context: z.string(),
});

export const SentencesAndAwardsSchema = z.object({
  sentences: z.array(
    z.object({
      type: z.string(),
      duration: z.string(),
      conditions: z.array(z.string()),
    }),
  ),
  awards: z.array(
    z.object({
      type: z.string(),
      amount: z.number(),
      currency: z.string(),
      recipient: z.string(),
    }),
  ),
  other_outcomes: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
    }),
  ),
});

export const CaseAnalysisSchema = z.object({
  metadata: MetadataSchema,
  factual_background: FactualBackgroundSchema,
  arguments_and_reasoning: ArgumentsAndReasoningSchema,
  decision_and_precedents: DecisionAndPrecedentsSchema,
  implications_and_context: ImplicationsAndContextSchema,
  sentences_and_awards: SentencesAndAwardsSchema,
  final_summary: z.string(),
  key_persons: KeyPersonSchema,
  legislation: LegislationAnalysisSchema,
  confidence: z.boolean(),
});

export type CaseAnalysis = z.infer<typeof CaseAnalysisSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type FactualBackground = z.infer<typeof FactualBackgroundSchema>;
export type ArgumentsAndReasoning = z.infer<typeof ArgumentsAndReasoningSchema>;
export type DecisionAndPrecedents = z.infer<typeof DecisionAndPrecedentsSchema>;
export type ImplicationsAndContext = z.infer<
  typeof ImplicationsAndContextSchema
>;
export type SentencesAndAwards = z.infer<typeof SentencesAndAwardsSchema>;

export interface LLMResponse {
  content: string;
  metadata?: {
    confidence?: number;
    tokens_used?: number;
  };
}

export interface SectionAnalysisResult<T> {
  data: T;
  confidence: number;
  needsRefinement: boolean;
}

export interface TokenCount {
  total: number;
  perSection: Record<string, number>;
}

export interface AnalysisPass {
  passNumber: number;
  focus: string;
  prompt: string;
}

export interface RAGPipelineConfig {
  maxTokens: number;
  passesPerSection: number;
  confidenceThreshold: number;
}

export interface LLMRefusal {
  reason: string;
  details?: string;
}

export interface AnalysisProcess {
  status: "pending" | "processing" | "completed" | "failed";
  currentSection?: keyof CaseAnalysis;
  currentPass?: number;
  error?: string;
}
