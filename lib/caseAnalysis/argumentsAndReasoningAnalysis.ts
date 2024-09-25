// lib/metadataAnalysis.ts

import { ArgumentsAndReasoningSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { argumentsAndReasoningPrompts } from "@/lib/prompts/argumentsAndReasoningPrompts";
import { ArgumentsAndReasoningConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/app/api/analyse-case/route";

//Should I have wet code for the other sections? Or should I make it dry?
export async function analyzeArgumentsAndReasoning(text: string): Promise<{
  argumentsAndReasoning: z.infer<typeof ArgumentsAndReasoningSchema>;
  confidence: z.infer<typeof ArgumentsAndReasoningConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialArgumentsAndReasoning = await analyzeSection(
    text,
    argumentsAndReasoningPrompts.initialExtraction,
    ArgumentsAndReasoningSchema,
  );

  // Verification and refinement
  const refinedArgumentsAndReasoning = await analyzeSection(
    JSON.stringify({ initialArgumentsAndReasoning, originalText: text }),
    argumentsAndReasoningPrompts.verificationAndRefinement,
    ArgumentsAndReasoningSchema,
  );

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedArgumentsAndReasoning, originalText: text }),
    argumentsAndReasoningPrompts.confidenceAssessment,
    ArgumentsAndReasoningConfidenceSchema,
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
    argumentsAndReasoning: refinedArgumentsAndReasoning,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
