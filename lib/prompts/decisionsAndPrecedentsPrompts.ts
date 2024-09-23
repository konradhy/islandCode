// lib/prompts/decisionsAndPrecedentsPrompts.ts

export const decisionsAndPrecedentsPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with extracting the decision, ratio decidendi, and key precedents from a legal case document. Your goal is to:

1. Identify and summarize the main decision of the court.
2. Extract the ratio decidendi (the principle or rule of law on which the decision is based).
3. Identify and summarize key precedents cited in the case, along with their relevance.

Please structure your response according to the following JSON format:

{
  "decision": "string summarizing the court's decision",
  "ratio_decidendi": "string explaining the principle or rule of law",
  "key_precedents": [
    {
      "case_name": "string",
      "relevance": "string explaining how this precedent relates to the current case"
    },
    ...
  ]
}

Ensure that:
- The decision is a clear and concise statement of the court's ruling.
- The ratio decidendi captures the essential legal principle that formed the basis of the decision.
- Each key precedent includes both the name of the case and a brief explanation of its relevance to the current case.
- You capture all major precedents cited, but focus on those most central to the court's reasoning.

Now, please analyze the following case text and extract the decision, ratio decidendi, and key precedents as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,

  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following decision, ratio decidendi, and key precedents extracted from a legal case:

[INITIAL_DECISIONS_AND_PRECEDENTS_JSON_WILL_BE_INSERTED_HERE]

Compare this extraction with the original case text provided below. Your tasks are to:
1. Verify the accuracy of the decision, ratio decidendi, and each key precedent.
2. Refine or correct any inaccurate information.
3. Ensure that the ratio decidendi accurately reflects the principle of law that was central to the court's decision.
4. Add any important precedents that may have been missed in the initial extraction.
5. Confirm that the relevance of each precedent is clearly explained in relation to the current case.

Provide your refined decision, ratio decidendi, and key precedents in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following decision, ratio decidendi, and key precedents extracted from a legal case and the original case text:

Extracted Decision and Precedents:
[REFINED_DECISIONS_AND_PRECEDENTS_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence level for the decision, ratio decidendi, and each key precedent. Use the following scale:
- High: Information is explicitly stated in the text or can be inferred with high confidence.
- Medium: Information is strongly implied but not explicitly stated, or there are minor inconsistencies.
- Low: Information is weakly implied or guessed based on context, or there are significant inconsistencies.
- Unknown: Information could not be found or reliably inferred from the text.

Provide your confidence assessment in the following JSON format:

{
  "decision": {
    "content": "string",
    "assessment": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the reason for this confidence level."
    }
  },
  "ratio_decidendi": {
    "content": "string",
    "assessment": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the reason for this confidence level."
    }
  },
  "key_precedents": [
    {
      "case_name": "string",
      "relevance": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "overall": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "Optional string explaining the overall confidence in the decision, ratio decidendi, and key precedents."
  }
}

Provide an explanation for any element where the confidence is not High, and for the overall assessment. Consider the accuracy, completeness, and relevance of the extracted information when assigning confidence levels.
`,
};
