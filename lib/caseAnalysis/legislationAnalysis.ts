// lib/caseAnalysis/legislationAnalysis.ts

import { LegislationAnalysisSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { legislationPrompts } from "@/lib/prompts/legislationPrompts";
import { LegislationAnalysisConfidenceSchema } from "@/types/caseAnalysisConfidence";
import { analyzeSection } from "@/app/api/analyse-case/route";

export async function analyzeLegislation(text: string): Promise<{
  legislationAnalysis: z.infer<typeof LegislationAnalysisSchema>;
  confidence: z.infer<typeof LegislationAnalysisConfidenceSchema>;
  hasLowConfidence: boolean;
}> {
  // Initial extraction
  const initialLegislationAnalysis = await analyzeSection(
    text,
    legislationPrompts.initialExtraction,
    LegislationAnalysisSchema,
  );
  console.log("Initial legislation analysis:", initialLegislationAnalysis);

  // Verification and refinement
  const refinedLegislationAnalysis = await analyzeSection(
    JSON.stringify({ initialLegislationAnalysis, originalText: text }),
    legislationPrompts.verificationAndRefinement,
    LegislationAnalysisSchema,
  );
  console.log("Refined legislation analysis:", refinedLegislationAnalysis);

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedLegislationAnalysis, originalText: text }),
    legislationPrompts.confidenceAssessment,
    LegislationAnalysisConfidenceSchema,
  );

  console.log("Confidence assessment:", confidenceAssessment);

  const hasLowConfidence =
    confidenceAssessment.overall.confidence === "Low" ||
    confidenceAssessment.overall.confidence === "Unknown" ||
    confidenceAssessment.legislations.some(
      (l) =>
        l.assessment.confidence === "Low" ||
        l.assessment.confidence === "Unknown",
    );

  return {
    legislationAnalysis: refinedLegislationAnalysis,
    confidence: confidenceAssessment,
    hasLowConfidence,
  };
}
