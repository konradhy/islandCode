// lib/metadataAnalysis.ts

import { MetadataSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { metadataPrompts } from "@/lib/prompts/metadataPrompts";
import { MetadataConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/lib/serverUtils";

//Should I have wet code for the other sections? Or should I make it dry?
export async function analyzeMetadata(
  text: string,
  quickAnalysis: boolean = false
): Promise<{
  metadata: z.infer<typeof MetadataSchema>;
  confidence: z.infer<typeof MetadataConfidenceSchema> | null;
  hasLowConfidence: boolean;
}> {
  if (quickAnalysis) {
    // Quick analysis: only make one call for initial extraction
    const initialMetadata = await analyzeSection(
      text,
      metadataPrompts.initialExtraction,
      MetadataSchema,
    );

    // Generate a generic low confidence assessment
  console.log("We ran metadata quick analysis")

    return {
      metadata: initialMetadata,
      confidence: null,
      hasLowConfidence: true,
    };
  }

  // Full analysis: proceed with the original implementation
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
  console.log("We ran metadata full analysis")

  return {
    metadata: refinedMetadata,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}


