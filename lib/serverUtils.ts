import PDFParser from 'pdf-parse';


export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await PDFParser(pdfBuffer);
    // Extract the first 10,000 characters
    const extractedText = data.text.slice(0, 10000);
    return extractedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return ''; // Return empty string if parsing fails
  }
}

