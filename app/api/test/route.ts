import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  

 try{

 
    return NextResponse.json({ text: "test" });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
  }
}