// lib/prompts/legislationPrompts.ts

export const legislationPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with identifying and analyzing the legislation relevant to a legal case. Your goal is to extract and summarize key information about laws, statutes, regulations, or other legislative acts mentioned in the case document. Please focus on the following:

1. Identify all legislation mentioned in the case.
2. For each piece of legislation, note the specific sections or articles referenced.
3. Explain how each piece of legislation relates to the case and how it's applied or distinguished.
4. Extract key snippets or quotes that demonstrate the legislation's relevance.
5. Assess the overall importance of each piece of legislation to the case's outcome.

Please structure your response according to the following JSON format:

{
  "legislations": [
    {
      "name": "Full name of the legislation",
      "sections_mentioned": ["Section or article numbers"],
      "relation_to_case": "What specifically about the case lead to this legislation being mentioned. and how is it applied or distinguished",
      "key_snippets": ["Direct quotes of the legislation. If there is no quote then leave blank"],
      "explanation": "Concise explanation of what the legislation means and how it's interpreted in this case",
      "relevance": "High|Medium|Low"
    }
  ]
}

Ensure that:
- You identify all relevant legislation, including laws, statutes, regulations, and international treaties if applicable.
- Specific sections or articles of the legislation are accurately noted when mentioned.
- The relation to the case clearly explains why this legislation is important and how it's being applied or distinguished in the case.
- Key snippets are direct quotes from the case document. These should be either:
  a) Quotes of the legislation itself when it's directly cited in the case, OR
  b) Quotes from the case text showing how the court is applying or interpreting the legislation.
- The explanation provides a concise summary of what the legislation means and how it's being interpreted in this specific case.
- The relevance is assessed as "High" for legislation central to the case's main issues, "Medium" for legislation that plays a supporting role, and "Low" for legislation that is mentioned but not crucial to the outcome.
- Only include legislation that is explicitly mentioned or clearly implied in the case document.
- If no legislation is mentioned in the case, return an empty array for "legislations".

Now, please analyze the following case text and extract the legislation information as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,
  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following legislation information extracted from a legal case:

[INITIAL_LEGISLATION_JSON_WILL_BE_INSERTED_HERE]

Compare this extraction with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each piece of legislation identified, including names and section numbers.
2. Ensure that the relation to the case and explanations are clear, accurate, and relevant.
3. Check that the key snippets are direct quotes from the case text and are properly contextualized.
4. Refine or correct any inaccurate information.
5. Add any important legislation or legal principles that may have been missed in the initial extraction.
6. Reassess the relevance ratings to ensure they accurately reflect the importance of each piece of legislation to the case.
7. Remove any legislation that was incorrectly identified or is not actually relevant to the case.

Provide your refined legislation analysis in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following legislation information extracted from a legal case and the original case text:

Extracted Legislation Information:
[REFINED_LEGISLATION_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence of your extraction and interpretation of the legislation mentioned in the case text. Use the following scale:
- High: The legislation and its details are explicitly stated in the text with no ambiguity.
- Medium: The legislation is mentioned, but some details require inference or are not completely clear.
- Low: The legislation is implied but not explicitly stated, or there is significant ambiguity about its role in the case.
- Unknown: The information about the legislation could not be reliably found or inferred from the text.

Provide your confidence assessment in the following JSON format:

{
  "legislations": [
    {
      "legislation": {
        "name": "string",
        "sections_mentioned": ["string"],
        "relation_to_case": "string",
        "key_snippets": ["string"],
        "explanation": "string",
        "relevance": "High|Medium|Low"
      },
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "String explaining the reason for this confidence level."
      }
    }
  ],
  "overall": {
    "confidence": "High|Medium|Low|Unknown",
    "explanation": "String explaining the overall confidence in the legislation analysis."
  }
}

Provide an explanation for any individual legislation where the confidence is not High, and for the overall assessment. Consider the clarity, specificity, and unambiguity of the information in the original text when assigning confidence levels.
`,
};
