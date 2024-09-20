// app/api/analyse-case/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
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
} from "@/lib/prompts/caseAnalysisPrompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  return completion.choices[0].message.parsed;
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    const intermediateResult: Partial<CaseAnalysis> = {};

    // You can improve the prompts by also providing intermediate results or parts of it to the next prompt
    // In the future This might be particularly useful when trying to show the application of law.
    intermediateResult.metadata = await analyzeSection(
      text,
      metadataPrompt,
      MetadataSchema,
    );

    intermediateResult.factual_background = await analyzeSection(
      text,
      factualBackgroundPrompt,
      FactualBackgroundSchema,
    );

    intermediateResult.arguments_and_reasoning = await analyzeSection(
      text,
      argumentsAndReasoningPrompt,
      ArgumentsAndReasoningSchema,
    );

    intermediateResult.decision_and_precedents = await analyzeSection(
      text,
      decisionAndPrecedentsPrompt,
      DecisionAndPrecedentsSchema,
    );

    intermediateResult.implications_and_context = await analyzeSection(
      text,
      implicationsAndContextPrompt,
      ImplicationsAndContextSchema,
    );

    intermediateResult.sentences_and_awards = await analyzeSection(
      text,
      sentencesAndAwardsPrompt,
      SentencesAndAwardsSchema,
    );

    // Generate final summary
    const finalSummaryResult = await analyzeSection(
      JSON.stringify(intermediateResult),
      getFinalSummaryPrompt(intermediateResult),
      FinalSummarySchema,
    );

    intermediateResult.final_summary = finalSummaryResult.summary;

    const finalAnalysis = mergeResults(intermediateResult);

    return NextResponse.json({ analysis: finalAnalysis });
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
