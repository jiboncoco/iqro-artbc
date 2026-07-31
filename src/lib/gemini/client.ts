import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_SYSTEM_INSTRUCTION, buildGeminiUserPrompt } from './prompts';
import { Verse } from '@/types/quran';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateQuranAnswer(userQuery: string, matchedVerses: Verse[]): Promise<string> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
  });

  const prompt = buildGeminiUserPrompt(userQuery, matchedVerses);

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 1024,
    },
  });

  return result.response.text();
}

export async function generateQueryEmbedding(text: string): Promise<number[]> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
