// app/api/analyse-case/route.ts

import { NextResponse } from "next/server";

import { zodResponseFormat } from "openai/helpers/zod";
import {
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
  decisionAndPrecedentsPrompt,
  implicationsAndContextPrompt,
  sentencesAndAwardsPrompt,
  getFinalSummaryPrompt,
  keyPersonsPrompt,
  LegislationPrompt,
} from "@/lib/prompts/caseAnalysisPrompts";

import { openai } from "@/lib/openaiConfig";
import { analyzeMetadata } from "@/lib/caseAnalysis/metadataAnalysis";
import { analyzeFactualBackground } from "@/lib/caseAnalysis/factualBackgroundAnalysis";
import { analyzeArgumentsAndReasoning } from "@/lib/caseAnalysis/argumentsAndReasoningAnalysis";
import { analyzeDecisionsAndPrecedents } from "@/lib/caseAnalysis/decisionsAndPrecedentsAnalysis";

export async function analyzeSection<T extends z.ZodType>(
  text: string,
  prompt: string,
  schema: T,
): Promise<z.infer<T>> {
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text },
    ],
    temperature: 0.7,
    response_format: zodResponseFormat(schema, "section_analysis"),
  });

  return completion.choices[0].message.parsed;
}

//So for Now. If the confidence is low for anything
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Analyze metadata using the new multi-pass approach
    const metadataAnalysis = await analyzeMetadata(text);
    const factualBackgroundAnalysis = await analyzeFactualBackground(text);
    const argumentsAndReasoningAnalysis =
      await analyzeArgumentsAndReasoning(text);
    const decisionsAndPrecedentsAnalysis =
      await analyzeDecisionsAndPrecedents(text);

    const analysis: Partial<CaseAnalysis> = {
      metadata: metadataAnalysis.metadata,
      factual_background: factualBackgroundAnalysis.factualBackground,
      arguments_and_reasoning:
        argumentsAndReasoningAnalysis.argumentsAndReasoning,
      decision_and_precedents:
        decisionsAndPrecedentsAnalysis.decisionsAndPrecedents,
    };

    if (
      metadataAnalysis.hasLowConfidence ||
      factualBackgroundAnalysis.hasLowConfidence ||
      argumentsAndReasoningAnalysis.hasLowConfidence ||
      decisionsAndPrecedentsAnalysis.hasLowConfidence
    ) {
      analysis.confidence = true;
    }
    // Analyze other sections

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
      // metadataConfidence: metadataAnalysis.confidence,
    });
  } catch (error) {
    console.error("Error analyzing case:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 },
    );
  }
}
