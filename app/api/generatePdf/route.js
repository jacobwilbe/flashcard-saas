import { IncomingForm } from 'formidable';
import { PDFJSLoader } from "langchain/document_loaders/fs/pdf";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RetrievalQA } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const prompt = `
Generate 10 flashcards from the following PDF. 
Return the flashcards in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error parsing form' });
    }

    const file = files.pdfFile;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Load PDF
      const loader = new PDFJSLoader(file.filepath);
      const docs = await loader.load();

      // Split text into chunks
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splitDocs = await textSplitter.splitDocuments(docs);

      // Create vector store
      const vectorStore = await HNSWLib.fromDocuments(splitDocs, new OpenAIEmbeddings());

      // Create chain
      const model = new ChatOpenAI({apiKey: process.env.OPENAI_API_KEY, modelName: 'gpt-4'});
      const chain = RetrievalQA.fromLLM(model, vectorStore.asRetriever());

      // Query the chain
      const response = await chain.call({
        query: prompt,
      });

      res.status(200).json({ response: response.text });
    } catch (error) {
      console.error('Error processing PDF:', error);
      res.status(500).json({ message: 'Error processing PDF' });
    }
  });
}