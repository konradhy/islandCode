// lib/prompts/argumentsAndReasoningPrompts.ts

export const argumentsAndReasoningPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with extracting the arguments and reasoning from a legal case document. Your goal is to:

1. Identify and summarize the main arguments presented by the plaintiff.
2. Identify and summarize the main arguments presented by the defendant.
3. Extract the court's reasoning and analysis of these arguments.

Please structure your response according to the following JSON format:

{
  "plaintiff_arguments": [
    "argument 1",
    "argument 2",
    ...
  ],
  "defendant_arguments": [
    "argument 1",
    "argument 2",
    ...
  ],
  "court_reasoning": [
    "reasoning point 1",
    "reasoning point 2",
    ...
  ]
}

Ensure that:
- Each argument is a concise, clear statement of a legal or factual point made by the respective party.
- The court's reasoning includes key points of analysis, application of law to facts, and any significant considerations mentioned by the court.
- You capture all major arguments and reasoning points, but avoid unnecessary details or repetition.


Now, please analyze the following case text and extract the arguments and reasoning as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,

  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following arguments and reasoning extracted from a legal case:

[INITIAL_ARGUMENTS_AND_REASONING_JSON_WILL_BE_INSERTED_HERE]

Compare this extraction with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each argument and reasoning point.
2. Refine or correct any inaccurate information.
3. Add any important arguments or reasoning points that may have been missed in the initial extraction.
4. Ensure that arguments and reasoning are presented in a logical order.
5. Confirm that the court's reasoning adequately addresses the main arguments presented by both parties.
6. Ensure that all arguments and reasoning points are covered and not missed.

Provide your refined arguments and reasoning in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following arguments and reasoning extracted from a legal case and the original case text:

Extracted Arguments and Reasoning:
[REFINED_ARGUMENTS_AND_REASONING_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence of your extraction and interpretation of the case text. Use the following scale:
- High: The information is explicitly stated in the text or can be inferred with high confidence. There is not any conflicting information in the text. The information appears to make sense given the context of the case.
- Medium: The information is strongly implied but not explicitly stated. Or there is some contradicting information. Or the information seems weird or out of place.
- Low: The information is weakly implied or guessed based on context. There is contradicting information in the text. The information appears to be incorrect or illogical. The information looks like gibberish.
- Unknown: The information could not be found or reliably inferred.

Remember you are not determining whether the information is true or false, you are only determining your confidence in the extraction.

Provide your confidence assessment in the following JSON format:

{
  "plaintiff_arguments": [
    {
      "argument": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "defendant_arguments": [
    {
      "argument": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "court_reasoning": [
    {
      "reasoning": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "overall": {
    "plaintiff_arguments": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in plaintiff arguments."
    },
    "defendant_arguments": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in defendant arguments."
    },
    "court_reasoning": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in court reasoning."
    }
  }
}

Provide an explanation for any individual argument or reasoning point where the confidence is not High, and for the overall assessments. Consider the accuracy, completeness, and relevance of the extracted information when assigning confidence levels.
`,
};
