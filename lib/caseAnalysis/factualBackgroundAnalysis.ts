// lib/factualBackgroundAnalysis.ts

import { FactualBackgroundSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { factualBackgroundPrompts } from "@/lib/prompts/factualBackgroundPrompts";
import { FactualBackgroundConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/lib/serverUtils";

export async function analyzeFactualBackground(text: string): Promise<{
  factualBackground: z.infer<typeof FactualBackgroundSchema>;
  confidence: z.infer<typeof FactualBackgroundConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialFactualBackground = await analyzeSection(
    text,
    factualBackgroundPrompts.initialExtraction,
    FactualBackgroundSchema,
  );

  // Verification and refinement
  const refinedFactualBackground = await analyzeSection(
    JSON.stringify({ initialFactualBackground, originalText: text }),
    factualBackgroundPrompts.verificationAndRefinement,
    FactualBackgroundSchema,
  );

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedFactualBackground, originalText: text }),
    factualBackgroundPrompts.confidenceAssessment,
    FactualBackgroundConfidenceSchema,
  );

  //double check if this really works TODO
  const hasLowConfidence = Object.values(confidenceAssessment).some(
    (assessments) =>
      assessments.some((assessment) => assessment.confidence === "Low"),
  );

  return {
    factualBackground: refinedFactualBackground,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
