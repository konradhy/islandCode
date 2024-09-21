// lib/metadataAnalysis.ts

import { openai } from "@/lib/openaiConfig";
import { zodResponseFormat } from "openai/helpers/zod";
import { MetadataSchema } from "@/types/caseAnalysis";
import { z } from "zod";
import { metadataPrompts } from "@/lib/prompts/metadataPrompts";
import { MetadataConfidenceSchema } from "@/types/caseAnalysisConfidence";

async function analyzeSection<T extends z.ZodType>(
  text: string,
  prompt: string,
  schema: T,
): Promise<z.infer<T>> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
    temperature: 0.7,
    response_format: zodResponseFormat(schema, "section_analysis"),
  });

  console.log("The prompt was: ", prompt);

  if (prompt === metadataPrompts.confidenceAssessment) {
    console.log(
      "Raw AI response:",
      JSON.stringify(completion.choices[0].message.content),
    );
  }
  return completion.choices[0].message.parsed;
}

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
  console.log("Initial metadata:", initialMetadata);

  // Verification and refinement
  const refinedMetadata = await analyzeSection(
    JSON.stringify({ initialMetadata, originalText: text }),
    metadataPrompts.verificationAndRefinement,
    MetadataSchema,
  );
  console.log("Refined metadata:", refinedMetadata);

  // Confidence assessment
  const confidenceAssessment = await analyzeSection(
    JSON.stringify({ refinedMetadata, originalText: text }),
    metadataPrompts.confidenceAssessment,
    MetadataConfidenceSchema,
  );

  console.log("Confidence assessment:", confidenceAssessment);

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
