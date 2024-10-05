// lib/caseAnalysis/sentencesAndAwardsAnalysis.ts

import { SentencesAndAwardsSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { sentencesAndAwardsPrompts } from "@/lib/prompts/sentencesAndAwardsPrompts";
import { SentencesAndAwardsConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/lib/serverUtils";

export async function analyzeSentencesAndAwards(text: string): Promise<{
  sentencesAndAwards: z.infer<typeof SentencesAndAwardsSchema>;
  confidence: z.infer<typeof SentencesAndAwardsConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialSentencesAndAwards = await analyzeSection(
    text,
    sentencesAndAwardsPrompts.initialExtraction,
    SentencesAndAwardsSchema,
  );


  // Verification and refinement
  const refinedSentencesAndAwards = await analyzeSection(
    JSON.stringify({ initialSentencesAndAwards, originalText: text }),
    sentencesAndAwardsPrompts.verificationAndRefinement,
    SentencesAndAwardsSchema,
  );


  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedSentencesAndAwards, originalText: text }),
    sentencesAndAwardsPrompts.confidenceAssessment,
    SentencesAndAwardsConfidenceSchema,
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
    sentencesAndAwards: refinedSentencesAndAwards,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
