// lib/metadataAnalysis.ts

import { DecisionAndPrecedentsSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { decisionsAndPrecedentsPrompts } from "@/lib/prompts/decisionsAndPrecedentsPrompts";
import { DecisionAndPrecedentsConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/app/api/analyse-case/route";

export async function analyzeDecisionsAndPrecedents(text: string): Promise<{
  decisionsAndPrecedents: z.infer<typeof DecisionAndPrecedentsSchema>;
  confidence: z.infer<typeof DecisionAndPrecedentsConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
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
