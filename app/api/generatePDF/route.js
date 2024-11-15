// Required dependencies
import {NextResponse} from 'next/server';
const pdfParse = require('pdf-parse');
import { OpenAI } from 'openai';




const systemPrompt = `
You are a flashcard creator specializing in creating educational flashcards from provided text. Your task is to generate **exactly 10 flashcards** that summarize key concepts, facts, or definitions from the text. Each flashcard should follow these guidelines:

1. **Front**: Write a concise question or phrase summarizing a key point from the text.
2. **Back**: Write a clear, single-sentence answer or explanation for the front of the card.
3. Focus on creating flashcards that are useful for understanding and remembering the core information from the text.
4. Avoid redundancy—each card should cover a unique concept or detail.

Return the flashcards in the following JSON format:
{
  "flashcards": [
    {
      "front": "Question or prompt for the front",
      "back": "Answer or explanation for the back"
    }
  ]
}
  `

export async function POST(req) {

  try {
    // Parse the uploaded file using formidable
    const data = await req.formData();
    const file = data.get('pdfFile');

    if (!file || !file.type.includes('pdf')) {
      return NextResponse.json({ error: 'Invalid or missing PDF file' });
    }

    // Read and parse the PDF
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(buffer);
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;
    if (!extractedText || extractedText.trim().length === 0) {
        console.error('No text extracted from PDF');
        return NextResponse.json({ error: 'No text could be extracted from the PDF' }, { status: 400 });
    }
    console.log(extractedText);

    // Call OpenAI API with extracted text
    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: extractedText },
        ],
        model: 'gpt-4',
        response_format: {type : 'json_object'},
        });
        console.log(completion);
        // Parse and return the flashcards
        const flashcards = JSON.parse(completion.choices[0].message.content);
        console.log(flashcards);
        return NextResponse.json(flashcards.flashcards);
    } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        return NextResponse.json({ 
          error: 'OpenAI API error', 
          details: openaiError.message,
          status: openaiError.status 
        }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing the request:', error);
    return NextResponse.json({ error: 'Failed to process the request', details: error.message }, { status: 500 });
  }
}
