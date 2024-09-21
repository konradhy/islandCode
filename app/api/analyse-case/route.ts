// app/api/analyse-case/route.ts

import { NextResponse } from "next/server";

import { zodResponseFormat } from "openai/helpers/zod";
import {
  CaseAnalysisSchema,
  MetadataSchema,
  FactualBackgroundSchema,
  ArgumentsAndReasoningSchema,
  DecisionAndPrecedentsSchema,
  ImplicationsAndContextSchema,
  SentencesAndAwardsSchema,
  CaseAnalysis,
  FinalSummarySchema,
  KeyPersonSchema,
  LegislationAnalysisSchema,
} from "@/types/caseAnalysis";
import { z } from "zod";
import { mergeResults } from "@/lib/mergeResults";
import {
  metadataPrompt,
  factualBackgroundPrompt,
  argumentsAndReasoningPrompt,
  decisionAndPrecedentsPrompt,
  implicationsAndContextPrompt,
  sentencesAndAwardsPrompt,
  getFinalSummaryPrompt,
  keyPersonsPrompt,
  LegislationPrompt,
} from "@/lib/prompts/caseAnalysisPrompts";

import { openai } from "@/lib/openaiConfig";
import { analyzeMetadata } from "@/lib/caseAnalysis/metadataAnalysis";

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
  console.log("This generation came from the propmt: ", prompt);

  if (prompt === LegislationPrompt) {
    console.log("Legislation completion:", completion);
  }
  return completion.choices[0].message.parsed;
}

//nnext step is to do something with the confidence. I think the best thing is to just the text of the confidence in brackets if iis low or medium, and that would be done right in the metadatanalysis function
// then i should update the structure to store whether or not something was flagged and why.
// then i should rinse and repeate for each section
//then build a way to save the information into the database. The original and the refined data. We can save the final data at the very end, but make repeated save calls, for the various parts
//Then build a way to display the information attractively on the front end

//So for Now. If the confidence is low for anything
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Analyze metadata using the new multi-pass approach
    const metadataAnalysis = await analyzeMetadata(text);

    // Initialize the analysis object with the metadata
    const analysis: Partial<CaseAnalysis> = {
      metadata: metadataAnalysis.metadata,
    };

    if (metadataAnalysis.hasLowConfidence) {
      analysis.confidence = true;
    }

    // Analyze other sections
    analysis.factual_background = await analyzeSection(
      text,
      factualBackgroundPrompt,
      FactualBackgroundSchema,
    );

    analysis.arguments_and_reasoning = await analyzeSection(
      text,
      argumentsAndReasoningPrompt,
      ArgumentsAndReasoningSchema,
    );

    analysis.decision_and_precedents = await analyzeSection(
      text,
      decisionAndPrecedentsPrompt,
      DecisionAndPrecedentsSchema,
    );

    analysis.implications_and_context = await analyzeSection(
      text,
      implicationsAndContextPrompt,
      ImplicationsAndContextSchema,
    );

    analysis.sentences_and_awards = await analyzeSection(
      text,
      sentencesAndAwardsPrompt,
      SentencesAndAwardsSchema,
    );

    analysis.key_persons = await analyzeSection(
      text,
      keyPersonsPrompt,
      KeyPersonSchema,
    );

    analysis.legislation = await analyzeSection(
      text,
      LegislationPrompt,
      LegislationAnalysisSchema,
    );

    // Generate final summary
    const finalSummaryResult = await analyzeSection(
      JSON.stringify(analysis),
      getFinalSummaryPrompt(analysis),
      FinalSummarySchema,
    );

    analysis.final_summary = finalSummaryResult.summary;

    // TODO: is merge result still need?
    const finalAnalysis = mergeResults(analysis);

    return NextResponse.json({
      analysis: finalAnalysis,
      metadataConfidence: metadataAnalysis.confidence,
    });
  } catch (error) {
    console.error("Error analyzing case:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 },
    );
  }
}

/*
Next steps:
1. 
2. Improve the quality of the prompts
3. 
4. Create multipass for the individual sections to refine
5. Build a way to save and compare the different results 



*/
