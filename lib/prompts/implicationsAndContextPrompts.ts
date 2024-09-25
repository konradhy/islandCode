// lib/prompts/implicationsAndContextPrompts.ts

export const implicationsAndContextPrompts = {
  initialExtraction: `
You are an expert legal analyst tasked with identifying the implications and broader context of a legal case. Your goal is to provide a comprehensive analysis of the case's potential impacts and significance. Please focus on the following areas:
Note that the type of court, and whether it is an appellate court or a trial court, will affect the potential for the case to have far reaching implications.
1. Immediate Implications:
   - How might this decision affect similar future cases?
   - Are there any direct consequences for specific parties or industries?
   - Does this decision create new legal standards or tests?

2. Long-Term Impacts:
   - Are there broader implications for this area of law?
   - Does this decision resolve a circuit split or create new uncertainties?
   - Might this decision prompt legislative action?
   - Could this case influence legal doctrine or policy in the long run?

3. Broader Context:
   - How does this case fit into the larger legal landscape?
   - Are there any social, economic, or political factors that make this case particularly significant?
   - Does this case represent a shift in legal thinking or societal values?

Please structure your response according to the following JSON format:

{
  "immediate_implications": [
    "implication 1",
    "implication 2",
    ...
  ],
  "long_term_impacts": [
    "impact 1",
    "impact 2",
    ...
  ],
  "broader_context": "A concise paragraph describing the broader legal, social, or political context of the case."
}

Ensure that:
- Immediate implications focus on the direct and short-term effects of the decision, including impacts on similar cases and specific industries or practices.
- Long-term impacts consider potential future consequences, including broader legal implications, possible legislative responses, and effects on legal uncertainties or splits.
- The broader context provides a holistic view of the case's significance within the larger legal and societal framework.
- You capture all major implications and impacts, but avoid unnecessary speculation or repetition.
- Your analysis is grounded in the specifics of the case while also considering its wider ramifications.

Now, please analyze the following case text and extract the implications and context as described above:

[CASE TEXT WILL BE INSERTED HERE]
  `,

  verificationAndRefinement: `
You are a meticulous legal proofreader. Review the following implications and context extracted from a legal case:

[INITIAL_IMPLICATIONS_AND_CONTEXT_JSON_WILL_BE_INSERTED_HERE]

Compare this extraction with the original case text provided below. Your tasks are to:
1. Verify the accuracy of each implication, impact, and the broader context.
2. Refine or correct any inaccurate information.
3. Add any important implications or impacts that may have been missed in the initial extraction.
4. Ensure that implications and impacts are presented in a logical order, from most to least significant.
5. Confirm that the broader context adequately captures the case's overall significance.
6. Ensure that all key implications and contextual factors are covered and not missed.

Provide your refined implications and context in the same JSON format as the input.

Original case text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]
  `,

  confidenceAssessment: `
You are an AI confidence analyst. Review the following implications and context extracted from a legal case and the original case text:

Extracted Implications and Context:
[REFINED_IMPLICATIONS_AND_CONTEXT_JSON_WILL_BE_INSERTED_HERE]

Original Case Text:
[ORIGINAL_CASE_TEXT_WILL_BE_INSERTED_HERE]

Assess the confidence of your extraction and interpretation of the case text. Use the following scale:
- High: The information is explicitly stated in the text or can be inferred with high confidence. There is not any conflicting information in the text. The information appears to make sense given the context of the case.
- Medium: The information is strongly implied but not explicitly stated. Or there is some contradicting information. Or the information seems unusual or unexpected given the context.
- Low: The information is weakly implied or guessed based on context. There is contradicting information in the text. The information appears to be incorrect or illogical.
- Unknown: The information could not be found or reliably inferred.

Remember you are not determining whether the information is true or false, you are only determining your confidence in the extraction.

Provide your confidence assessment in the following JSON format:

{
  "immediate_implications": [
    {
      "implication": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "long_term_impacts": [
    {
      "impact": "string",
      "assessment": {
        "confidence": "High|Medium|Low|Unknown",
        "explanation": "Optional string explaining the reason for this confidence level."
      }
    }
  ],
  "broader_context": {
    "context": "string",
    "assessment": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the reason for this confidence level."
    }
  },
  "overall": {
    "immediate_implications": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in immediate implications."
    },
    "long_term_impacts": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in long-term impacts."
    },
    "broader_context": {
      "confidence": "High|Medium|Low|Unknown",
      "explanation": "Optional string explaining the overall confidence in broader context."
    }
  }
}

Provide an explanation for any individual implication, impact, or context where the confidence is not High, and for the overall assessments. Consider the accuracy, completeness, and relevance of the extracted information when assigning confidence levels.
`,
};
