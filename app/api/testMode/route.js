import {NextResponse} from 'next/server';
import {OpenAI} from 'openai';

const systemPrompt = `
Your role is to evaluate whether or not the users provided answer is sufficiently equivalent to the answer provided on the back of the the flashcard. The answer does not have to be the same as the answer on the back of the flashcard, but it must be close enough to be considered correct. The answer and flashcard back are provided in the following format:
"Answer: answer Back: back". Your response should be one word, True if the answer is correct, False if the answer is incorrect. For example:

Answer: Paris. Back: The capital of France is Paris.

Response: True
`


export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages : [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],
        model: "gpt-4o",
        max_tokens: 1
    })

    const result = completion.choices[0].message.content.trim()
    console.log("Api response", result)

    return NextResponse.json({result})
}