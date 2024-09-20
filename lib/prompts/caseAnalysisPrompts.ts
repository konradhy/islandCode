// lib/prompts/caseAnalysisPrompts.ts
import { IntermediateAnalysisResult } from "@/types/intermediateResults";

export const metadataPrompt = "Extract case metadata and procedural history.";
export const factualBackgroundPrompt = "Extract key facts and legal issues.";
export const argumentsAndReasoningPrompt =
  "Summarize arguments and court's reasoning.";
export const decisionAndPrecedentsPrompt =
  "Extract decision, ratio decidendi, and key precedents.";
export const implicationsAndContextPrompt =
  "Analyze implications and broader context.";
export const sentencesAndAwardsPrompt =
  "Extract sentences, awards, and other concrete outcomes.";
export const finalSummaryPrompt =
  "Generate a comprehensive summary of the case analysis.";

// Alternatively, if you want more flexibility:
export function getFinalSummaryPrompt(
  intermediateResult: IntermediateAnalysisResult,
): string {
  return `Generate a comprehensive summary of the case analysis based on the following information:\n${JSON.stringify(intermediateResult, null, 2)}`;
}
