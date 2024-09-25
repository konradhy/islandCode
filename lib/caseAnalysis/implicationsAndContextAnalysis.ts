// lib/caseAnalysis/implicationsAndContextAnalysis.ts

import { ImplicationsAndContextSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { implicationsAndContextPrompts } from "@/lib/prompts/implicationsAndContextPrompts";
import { ImplicationsAndContextConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/app/api/analyse-case/route";

export async function analyzeImplicationsAndContext(text: string): Promise<{
  implicationsAndContext: z.infer<typeof ImplicationsAndContextSchema>;
  confidence: z.infer<typeof ImplicationsAndContextConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialImplicationsAndContext = await analyzeSection(
    text,
    implicationsAndContextPrompts.initialExtraction,
    ImplicationsAndContextSchema,
  );

  // Verification and refinement
  const refinedImplicationsAndContext = await analyzeSection(
    JSON.stringify({ initialImplicationsAndContext, originalText: text }),
    implicationsAndContextPrompts.verificationAndRefinement,
    ImplicationsAndContextSchema,
  );

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedImplicationsAndContext, originalText: text }),
    implicationsAndContextPrompts.confidenceAssessment,
    ImplicationsAndContextConfidenceSchema,
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
    implicationsAndContext: refinedImplicationsAndContext,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
