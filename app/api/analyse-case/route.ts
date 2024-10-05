// app/api/analyse-case/route.ts

import { NextResponse } from "next/server";


import {

  CaseAnalysis,
  FinalSummarySchema,
  KeyPersonSchema,

} from "@/types/caseAnalysis";

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
import { analyzeImplicationsAndContext } from "@/lib/caseAnalysis/implicationsAndContextAnalysis";
import { analyzeSentencesAndAwards } from "@/lib/caseAnalysis/sentencesAndAwardsAnalysis";
import { analyzeLegislation } from "@/lib/caseAnalysis/legislationAnalysis";
import { analyzeSection } from "@/lib/serverUtils";



//So for Now. If the confidence is low for anything
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Run all analyses concurrently
    const [
      metadataAnalysis,
      factualBackgroundAnalysis,
      argumentsAndReasoningAnalysis,
      decisionsAndPrecedentsAnalysis,
      implicationsAndContextAnalysis,
      sentencesAndAwardsAnalysis,
      legislationAnalysis
    ] = await Promise.all([
      analyzeMetadata(text, true),
      analyzeFactualBackground(text),
      analyzeArgumentsAndReasoning(text),
      analyzeDecisionsAndPrecedents(text, true),
      analyzeImplicationsAndContext(text),
      analyzeSentencesAndAwards(text),
      analyzeLegislation(text)
    ]);

    const analysis: Partial<CaseAnalysis> = {
      metadata: metadataAnalysis.metadata,
      factual_background: factualBackgroundAnalysis.factualBackground,
      arguments_and_reasoning:
        argumentsAndReasoningAnalysis.argumentsAndReasoning,
      decision_and_precedents:
        decisionsAndPrecedentsAnalysis.decisionsAndPrecedents,
      implications_and_context:
        implicationsAndContextAnalysis.implicationsAndContext,
      sentences_and_awards: sentencesAndAwardsAnalysis.sentencesAndAwards,
      legislation: legislationAnalysis.legislationAnalysis,
    };

    if (
      metadataAnalysis.hasLowConfidence ||
      factualBackgroundAnalysis.hasLowConfidence ||
      argumentsAndReasoningAnalysis.hasLowConfidence ||
      decisionsAndPrecedentsAnalysis.hasLowConfidence ||
      implicationsAndContextAnalysis.hasLowConfidence ||
      sentencesAndAwardsAnalysis.hasLowConfidence ||
      legislationAnalysis.hasLowConfidence
    ) {
      analysis.confidence = true;
    }
    // Analyze other sections

    analysis.key_persons = await analyzeSection(
      text,
      keyPersonsPrompt,
      KeyPersonSchema,
    );

    // Generate final summary
    const finalSummaryResult = await analyzeSection(
      JSON.stringify(analysis),
      getFinalSummaryPrompt(analysis),
      FinalSummarySchema,
    );

    analysis.final_summary = finalSummaryResult.summary;


    return NextResponse.json({
      analysis,
      metadataConfidence: metadataAnalysis.confidence,
      legislationConfidence: legislationAnalysis.confidence,
      factualBackgroundConfidence: factualBackgroundAnalysis.confidence,
      argumentsAndReasoningConfidence: argumentsAndReasoningAnalysis.confidence,
      decisionsAndPrecedentsConfidence:
        decisionsAndPrecedentsAnalysis.confidence,
      implicationsAndContextConfidence:
        implicationsAndContextAnalysis.confidence,
      sentencesAndAwardsConfidence: sentencesAndAwardsAnalysis.confidence,
    });
  } catch (error) {
    console.error("Error analyzing case:", error);
    return NextResponse.json(
      { error: "Failed to analyze text" },
      { status: 500 },
    );
  }
}
