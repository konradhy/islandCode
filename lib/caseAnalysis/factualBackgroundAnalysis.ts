// lib/factualBackgroundAnalysis.ts

import { FactualBackgroundSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { factualBackgroundPrompts } from "@/lib/prompts/factualBackgroundPrompts";
import { FactualBackgroundConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/lib/serverUtils";

export async function analyzeFactualBackground(text: string, quickAnalysis: boolean = false): Promise<{
  factualBackground: z.infer<typeof FactualBackgroundSchema>;
  confidence: z.infer<typeof FactualBackgroundConfidenceSchema> | null;
  hasLowConfidence: boolean;
}> {
  if (quickAnalysis) {
    // Quick analysis: only make one call for initial extraction
    const initialFactualBackground = await analyzeSection(
      text,
      factualBackgroundPrompts.initialExtraction,
      FactualBackgroundSchema,
    );

 console.log("We ran factual background quick analysis")
  
  return {
    factualBackground: initialFactualBackground,
    confidence: null,
    hasLowConfidence: true,
  };
  }
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
  console.log("We ran factual background full analysis")

  return {
    factualBackground: refinedFactualBackground,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
