import PDFParser from 'pdf-parse';
import { openai } from "@/lib/openaiConfig";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await PDFParser(pdfBuffer);

    const extractedText = data.text.slice(0, 7500);
    return extractedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return ''; 
  }
}

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

