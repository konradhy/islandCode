// lib/metadataAnalysis.ts

import { DecisionAndPrecedentsSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { decisionsAndPrecedentsPrompts } from "@/lib/prompts/decisionsAndPrecedentsPrompts";
import { DecisionAndPrecedentsConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/lib/serverUtils";

export async function analyzeDecisionsAndPrecedents(text: string, quickAnalysis: boolean = false): Promise<{
  decisionsAndPrecedents: z.infer<typeof DecisionAndPrecedentsSchema>;
  confidence: z.infer<typeof DecisionAndPrecedentsConfidenceSchema> | null;
  hasLowConfidence: boolean;
}> {
  if (quickAnalysis) {
    // Quick analysis: only make one call for initial extraction
    const initialDecisionsAndPrecedents = await analyzeSection(
      text,
    decisionsAndPrecedentsPrompts.initialExtraction,
    DecisionAndPrecedentsSchema,
  );

  console.log("We ran decisions and precedents quick analysis")

  return {
    decisionsAndPrecedents: initialDecisionsAndPrecedents,
    confidence: null,
    hasLowConfidence: true,
  };
  }
 const initialDecisionsAndPrecedents = await analyzeSection(
      text,
    decisionsAndPrecedentsPrompts.initialExtraction,
    DecisionAndPrecedentsSchema,
  );

  // Verification and refinement
  const refinedDecisionsAndPrecedents = await analyzeSection(
    JSON.stringify({ initialDecisionsAndPrecedents, originalText: text }),
    decisionsAndPrecedentsPrompts.verificationAndRefinement,
    DecisionAndPrecedentsSchema,
  );

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedDecisionsAndPrecedents, originalText: text }),
    decisionsAndPrecedentsPrompts.confidenceAssessment,
    DecisionAndPrecedentsConfidenceSchema,
  );

  const hasLowConfidence = Object.values(confidenceAssessment).some((field) => {
    if (typeof field === "object" && field !== null) {
      if ("confidence" in field) {
        return field.confidence === "Low" || field.confidence === "Unknown";
      }
      return Object.values(field).some(
        (subField) =>
          subField.confidence === "Low" || subField.confidence === "Unknown",
      );
    }

    return false;
  });

  return {
    decisionsAndPrecedents: refinedDecisionsAndPrecedents,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
