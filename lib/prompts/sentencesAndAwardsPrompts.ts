// lib/prompts/sentencesAndAwardsPrompts.ts

export const sentencesAndAwardsPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with extracting specific outcomes from a legal case document. Your goal is to identify and summarize:

1. Sentences: Any criminal or civil penalties imposed by the court.
2. Awards: Financial compensations or damages awarded to any party.
3. Other Outcomes: Any other significant rulings or orders made by the court.

Please structure your response according to the following JSON format:

{
  "sentences": [
    {
      "type": "string (e.g., 'imprisonment', 'probation', 'community service')",
      "duration": "string (e.g., '5 years', '200 hours')",
      "conditions": ["condition 1", "condition 2", ...]
    }
  ],
  "awards": [
    {
      "type": "string (e.g., 'compensatory damages', 'punitive damages')",
      "amount": number,
      "currency": "string (e.g., 'USD', 'EUR')",
      "recipient": "string (e.g., 'plaintiff', 'defendant')"
    }
  ],
  "other_outcomes": [
    {
      "type": "string (e.g., 'injunction', 'declaratory relief')",
      "description": "string describing the outcome"
    }
  ]
}

Ensure that:
- You only include sentences, awards, or other outcomes that are explicitly mentioned in the case document.
- For sentences, include the type, duration, and any specific conditions attached.
- For financial awards, only include them if there's an explicit monetary amount mentioned. Specify the type, exact amount, currency, and recipient.
- Include any other significant outcomes, such as injunctions, declaratory judgments, or specific orders in the "other_outcomes" section.
- Be as precise and specific as possible, using exact figures and terms from the case document.
- If no sentences, awards, or other outcomes are mentioned for a category, leave that category as an empty array.
- Do not create entries with zero amounts or placeholder values.

Now, please analyze the following case text and extract only the explicitly mentioned sentences, awards, and other outcomes as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,
  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following sentences, awards, and other outcomes extracted from a legal case:

[INITIAL_SENTENCES_AND_AWARDS_JSON_WILL_BE_INSERTED_HERE]

Compare this extraction with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each sentence, award, and other outcome.
2. Refine or correct any inaccurate information, especially regarding durations, amounts, and specific conditions.
3. Add any important sentences, awards, or outcomes that may have been missed in the initial extraction.
4. Ensure that all information is presented clearly and consistently.
5. Double-check that the types, durations, amounts, and recipients are correctly categorized.
6. If any information seems ambiguous in the original text, note this in your refinement.

Provide your refined sentences, awards, and other outcomes in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following sentences, awards, and other outcomes extracted from a legal case and the original case text:

Extracted Sentences, Awards, and Other Outcomes:
[REFINED_SENTENCES_AND_AWARDS_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence of your extraction and interpretation of the case text. Use the following scale:
- High: The information is explicitly stated in the text and there is no ambiguity.
- Medium: The information is stated in the text but there might be some minor ambiguity or it requires some inference.
- Low: The information is implied but not explicitly stated, or there is significant ambiguity.
- Unknown: The information could not be found or reliably inferred from the text.

Provide your confidence assessment in the following JSON format:

{
  "sentences": [
    {
      "sentence": {
        "type": "string",
        "duration": "string",
        "conditions": ["string"]
      },
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "awards": [
    {
      "award": {
        "type": "string",
        "amount": number,
        "currency": "string",
        "recipient": "string"
      },
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "other_outcomes": [
    {
      "outcome": {
        "type": "string",
        "description": "string"
      },
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "overall": {
    "sentences": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in sentences extraction."
    },
    "awards": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in awards extraction."
    },
    "other_outcomes": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in other outcomes extraction."
    }
  }
}

Provide an explanation for any individual sentence, award, or outcome where the confidence is not High, and for the overall assessments. Consider the clarity, specificity, and unambiguity of the information in the original text when assigning confidence levels.
`,
};
