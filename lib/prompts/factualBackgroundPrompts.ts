// lib/prompts/factualBackgroundPrompts.ts

export const factualBackgroundPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with extracting the factual background and identifying key legal issues from a legal case document. Your goal is to:

1. Identify and summarize the key facts of the case.
2. List the main legal issues presented in the case.

Please structure your response according to the following format:

{
  "key_facts": ["string"],
  "legal_issues": ["string"]
}

Ensure that:
- Each key fact is a concise, clear statement of an important event or circumstance in the case.
- Legal issues are phrased as questions or statements about the legal principles in dispute.
- You include all relevant facts and issues, but avoid unnecessary details.

Now, please analyze the following case text and extract the factual background as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,

  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following factual background extracted from a legal case:

[INITIAL_FACTUAL_BACKGROUND_JSON_WILL_BE_INSERTED_HERE]

Compare this factual background with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each key fact and legal issue.
2. Refine or correct any inaccurate information.
3. Add any important facts or legal issues that may have been missed in the initial extraction.
4. Ensure that facts are presented in a logical order, typically chronological for events.
5. Confirm that legal issues are clearly and accurately stated.

Provide your refined factual background in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,
  confidenceAssessment: `
You are an AI confidence analyst. Review the following factual background extracted from a legal case and the original case text:

Extracted Factual Background:
[REFINED_FACTUAL_BACKGROUND_JSON_WILL_BE_INSERTED_HERE]

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
  "key_facts": [
    {
      "fact": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "legal_issues": [
    {
      "issue": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "overall": {
    "key_facts": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in key facts."
    },
    "legal_issues": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in legal issues."
    }
  }
}

Provide an explanation for any individual fact or issue where the confidence is not High, and for the overall assessments. Consider the accuracy, completeness, and relevance of the extracted information when assigning confidence levels.
`,
};
