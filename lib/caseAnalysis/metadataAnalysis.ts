// lib/metadataAnalysis.ts

import { MetadataSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { metadataPrompts } from "@/lib/prompts/metadataPrompts";
import { MetadataConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/app/api/analyse-case/route";

//Should I have wet code for the other sections? Or should I make it dry?
export async function analyzeMetadata(text: string): Promise<{
  metadata: z.infer<typeof MetadataSchema>;
  confidence: z.infer<typeof MetadataConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialMetadata = await analyzeSection(
    text,
    metadataPrompts.initialExtraction,
    MetadataSchema,
  );

  // Verification and refinement
  const refinedMetadata = await analyzeSection(
    JSON.stringify({ initialMetadata, originalText: text }),
    metadataPrompts.verificationAndRefinement,
    MetadataSchema,
  );

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedMetadata, originalText: text }),
    metadataPrompts.confidenceAssessment,
    MetadataConfidenceSchema,
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
    metadata: refinedMetadata,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
