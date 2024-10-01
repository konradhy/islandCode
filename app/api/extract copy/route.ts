import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
  const { pdfUrl } = await request.json();

  if (!pdfUrl) {
    return NextResponse.json({ error: 'No PDF URL provided' }, { status: 400 });
  }

  try {
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    return NextResponse.json({ text: pdfData.text });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
  }
}