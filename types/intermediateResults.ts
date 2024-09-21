// types/intermediateResults.ts

//delete this? You still use it in mergeResults.ts
export interface IntermediateMetadata {
  case_name?: string;
  citation?: string;
  court?: string;
  parties?: {
    plaintiff?: string;
    defendant?: string;
  };
  procedural_history?: string[];
}

export interface IntermediateFactualBackground {
  key_facts?: string[];
  legal_issues?: string[];
}

export interface IntermediateArgumentsAndReasoning {
  plaintiff_arguments?: string[];
  defendant_arguments?: string[];
  court_reasoning?: string[];
}

export interface IntermediateDecisionAndPrecedents {
  decision?: string;
  ratio_decidendi?: string;
  key_precedents?: Array<{
    case_name?: string;
    relevance?: string;
  }>;
}

export interface IntermediateImplicationsAndContext {
  immediate_implications?: string[];
  long_term_impacts?: string[];
  broader_context?: string;
}

export interface IntermediateSentencesAndAwards {
  sentences?: Array<{
    type?: string;
    duration?: string;
    conditions?: string[];
  }>;
  awards?: Array<{
    type?: string;
    amount?: number;
    currency?: string;
    recipient?: string;
  }>;
  other_outcomes?: Array<{
    type?: string;
    description?: string;
  }>;
}

export interface IntermediateLegislationAnalysis {
  legislations?: Array<{
    name?: string;
    sections_mentioned?: string[];
    relation_to_case?: string;
    key_snippets?: string[];
    explanation?: string;
    relevance?: string;
  }>;
}

export interface IntermediateKeyPersons {
  persons?: Array<{
    name?: string;
    role?: string;
    relationships?: Array<{
      related_to?: string;
      relationship?: string;
    }>;
    significant_actions_or_statements?: string[];
  }>;
}

export interface IntermediateAnalysisResult {
  metadata?: IntermediateMetadata;
  factual_background?: IntermediateFactualBackground;
  arguments_and_reasoning?: IntermediateArgumentsAndReasoning;
  decision_and_precedents?: IntermediateDecisionAndPrecedents;
  implications_and_context?: IntermediateImplicationsAndContext;
  sentences_and_awards?: IntermediateSentencesAndAwards;
  legislation?: IntermediateLegislationAnalysis;
  key_persons?: IntermediateKeyPersons;
  final_summary?: string;
  confidence?: boolean;
}
