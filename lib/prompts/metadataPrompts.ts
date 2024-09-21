// lib/prompts/metadataPrompts.ts

export const metadataPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with extracting key metadata from a legal case document. Your goal is to identify and structure the following information:

1. Case Name: The official title of the case.
2. Citation: The full legal citation for this case.
3. Court: The name of the court where this case was heard.
4. Parties: Identify the plaintiff(s) and defendant(s) in the case.
5. Procedural History: A brief chronological summary of the case's journey through the legal system.

Please structure your response according to the following format:

{
  "case_name": "string",
  "citation": "string",
  "court": "string",
  "parties": {
    "plaintiff": "string",
    "defendant": "string"
  },
  "procedural_history": ["string"]
}

Ensure all fields are filled with the appropriate information. If any information is not explicitly stated in the text, use your best judgment to infer it or mark it as "Not specified" if it cannot be reasonably determined.

Now, please analyze the following case text and extract the metadata as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,

  //am i sure this is inserting correctly?
  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following metadata extracted from a legal case:

[INITIAL_METADATA_JSON_WILL_BE_INSERTED_HERE]

Compare this metadata with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each field.
2. Refine or correct any inaccurate information.
3. Fill in any "Not specified" fields if the information can be found or reasonably inferred from the text.
4. Ensure the procedural history is in chronological order and covers all major steps in the case's progression.

Provide your refined metadata in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following metadata extracted from a legal case and the original case text:

Extracted Metadata:
[REFINED_METADATA_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence level for each field in the metadata by comparing it with the original text. Use the following scale:
- High: Information is explicitly stated in the text or can be inferred with high confidence. There is not any conflicting information in the text. The information appears to make sense given the context of the case. 
- Medium: Information is strongly implied but not explicitly stated. Or there is some contradicting information. Or the information seems weird or out of place. 
- Low: Information is weakly implied or guessed based on context. There is contradicting information in the text. The information appears to be incorrect or illogical. The information looks like gibberish. 
- Unknown: Information could not be found or reliably inferred.

Provide your confidence assessment in the following JSON format:

{
  "case_name": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
  },
  "citation": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
  },
  "court": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
  },
  "parties": {
    "plaintiff": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
    },
    "defendant": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
    }
  },
  "procedural_history": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "String explaining the reason for this confidence level. REQUIRED for all confidence levels."
  }
}

IMPORTANT: You MUST provide an explanation for ALL fields, regardless of confidence level. The explanation should briefly describe why you assigned that confidence level, referencing the original text where applicable.
`,
};
