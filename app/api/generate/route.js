import {NextResponse} from 'next/server';
import {OpenAI} from 'openai';


const systemPrompt = `
You are a skilled flashcard creator with a focus on educational clarity and conciseness. Your task is to generate **exactly 10 flashcards** based on the provided input text, which could range from a single topic word to a detailed instructional text.

Instructions:
1. **For Short Inputs (Single Word or Simple Topic)**:
   - Generate flashcards that break down essential subtopics, definitions, related terms, or key facts about the topic.
   - Each card should address a unique aspect to provide a well-rounded understanding.

2. **For Longer, Detailed Inputs**:
   - Summarize and simplify complex information into digestible questions and answers.
   - Extract the most important points, definitions, or instructions from the text.
   - Each flashcard should focus on a separate key concept or detail.

**Guidelines for Each Flashcard**:
- **Front**: Write a question, prompt, or main idea for the user to consider.
- **Back**: Provide a clear, single-sentence answer or explanation for the front.
- Aim for variety and avoid repeating the same information across cards.

Return the flashcards in this JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card with question or prompt",
      "back": "Back of the card with answer or explanation"
    }
  ]
}
`


export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages : [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data},
        ],
        model: "gpt-4",
        response_format: {type : 'json_object'}
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}


