import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_SYSTEM_INSTRUCTION, buildGeminiUserPrompt } from './prompts';
import { Verse } from '@/types/quran';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateQuranAnswer(userQuery: string, matchedVerses: Verse[]): Promise<string> {
  if (!genAI || !apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const modelNames = ['gemini-[#1.5-flash]', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro-latest'];
  
  // Try available models sequentially
  for (const modelName of ['gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro']) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
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

      if (result && result.response && result.response.text()) {
        return result.response.text();
      }
    } catch (err: any) {
      console.warn(`Model ${modelName} attempt failed:`, err.message);
    }
  }

  throw new Error('Semua model Gemini sedang tidak dapat diakses saat ini.');
}

export async function generateQueryEmbedding(text: string): Promise<number[]> {
  if (!genAI || !apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
