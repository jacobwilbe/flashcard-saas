import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import {NextResponse} from 'next/server';
import OpenAI from 'openai';


const systemPrompt = `
You are a flashcard creator, you take in text created from a PDF and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export default async function POST(req) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  try {
    form.parse(req, async (err, fields, files) => {
        if (err) {
          return NextResponse.json({ error: 'Error parsing form data' });
        }
    
        const file = files.pdfFile;
        if (!file) {
          return NextResponse.json({ error: 'No file uploaded' });
        }
    
        try {
            const openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            })
            const buffer = fs.readFileSync(file.filepath);
            const data = await pdf(buffer);
            const text = data.text;
    
            // Here, you would process the text and generate flashcards
            // This could involve calling the OpenAI API
    
            const completion = await openai.chat.completions.create({
                messages : [
                    {role: 'system', content: systemPrompt},
                    {role: 'user', content: text},
                ],
                model: "gpt-4o",
                response_format: {type : 'json_object'}
            })
    
    
          const flashcards = JSON.parse(completion.choices[0].message.content)
          return NextResponse.json(flashcards.flashcards)
        } catch (error) {
          return NextResponse.json({ error: 'Error processing PDF' });
        }
      });

  } catch (error) {
    console.error('Error: this is the error', error);
  }
}
