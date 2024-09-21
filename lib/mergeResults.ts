// utils/mergeResults.ts

import { CaseAnalysis } from "../types/caseAnalysis";
import { IntermediateAnalysisResult } from "../types/intermediateResults";

export function mergeResults(
  intermediateResult: IntermediateAnalysisResult,
): CaseAnalysis {
  return {
    metadata: {
      case_name: intermediateResult.metadata?.case_name ?? "",
      citation: intermediateResult.metadata?.citation ?? "",
      court: intermediateResult.metadata?.court ?? "",
      parties: {
        plaintiff: intermediateResult.metadata?.parties?.plaintiff ?? "",
        defendant: intermediateResult.metadata?.parties?.defendant ?? "",
      },
      procedural_history: intermediateResult.metadata?.procedural_history ?? [],
    },
    factual_background: {
      key_facts: intermediateResult.factual_background?.key_facts ?? [],
      legal_issues: intermediateResult.factual_background?.legal_issues ?? [],
    },
    arguments_and_reasoning: {
      plaintiff_arguments:
        intermediateResult.arguments_and_reasoning?.plaintiff_arguments ?? [],
      defendant_arguments:
        intermediateResult.arguments_and_reasoning?.defendant_arguments ?? [],
      court_reasoning:
        intermediateResult.arguments_and_reasoning?.court_reasoning ?? [],
    },
    decision_and_precedents: {
      decision: intermediateResult.decision_and_precedents?.decision ?? "",
      ratio_decidendi:
        intermediateResult.decision_and_precedents?.ratio_decidendi ?? "",
      key_precedents:
        intermediateResult.decision_and_precedents?.key_precedents?.map(
          (precedent) => ({
            case_name: precedent.case_name ?? "",
            relevance: precedent.relevance ?? "",
          }),
        ) ?? [],
    },
    implications_and_context: {
      immediate_implications:
        intermediateResult.implications_and_context?.immediate_implications ??
        [],
      long_term_impacts:
        intermediateResult.implications_and_context?.long_term_impacts ?? [],
      broader_context:
        intermediateResult.implications_and_context?.broader_context ?? "",
    },
    sentences_and_awards: {
      sentences:
        intermediateResult.sentences_and_awards?.sentences?.map((sentence) => ({
          type: sentence.type ?? "",
          duration: sentence.duration ?? "",
          conditions: sentence.conditions ?? [],
        })) ?? [],
      awards:
        intermediateResult.sentences_and_awards?.awards?.map((award) => ({
          type: award.type ?? "",
          amount: award.amount ?? 0,
          currency: award.currency ?? "",
          recipient: award.recipient ?? "",
        })) ?? [],
      other_outcomes:
        intermediateResult.sentences_and_awards?.other_outcomes?.map(
          (outcome) => ({
            type: outcome.type ?? "",
            description: outcome.description ?? "",
          }),
        ) ?? [],
    },
    legislation: {
      legislations:
        intermediateResult.legislation?.legislations?.map((legislation) => ({
          name: legislation.name ?? "",
          sections_mentioned: legislation.sections_mentioned ?? [],
          relation_to_case: legislation.relation_to_case ?? "",
          key_snippets: legislation.key_snippets ?? [],
          explanation: legislation.explanation ?? "",
          relevance: legislation.relevance ?? "",
        })) ?? [],
    },
    key_persons: {
      persons:
        intermediateResult.key_persons?.persons?.map((person) => ({
          name: person.name ?? "",
          role: person.role ?? "",
          relationships:
            person.relationships?.map((rel) => ({
              related_to: rel.related_to ?? "",
              relationship: rel.relationship ?? "",
            })) ?? [],
          significant_actions_or_statements:
            person.significant_actions_or_statements ?? [],
        })) ?? [],
    },
    final_summary: intermediateResult.final_summary ?? "",
    confidence: intermediateResult.confidence ?? false,
  };
}
