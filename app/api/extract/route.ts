import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { Buffer } from 'buffer';



export async function POST(request: NextRequest) {

  const data = await request.formData();
  const file: File | null = data.get('pdf') as unknown as File;


  if (!file) {
    return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
  }

  try {

       const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const pdfData = await pdfParse(buffer);
    console.log(pdfData.text)
    return NextResponse.json({ text: pdfData.text });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
  }
}