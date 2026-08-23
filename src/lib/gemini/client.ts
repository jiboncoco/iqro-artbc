import { GoogleGenerativeAI, TaskType } from '@google/generative-ai';
import { GEMINI_SYSTEM_INSTRUCTION, buildGeminiUserPrompt } from './prompts';
import { Verse } from '@/types/quran';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateQuranAnswer(userQuery: string, matchedVerses: Verse[]): Promise<string> {
  if (!genAI || !apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }

  // Try available models sequentially
  for (const modelName of ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-3.5-flash-lite']) {
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

  // Must match the verses.embedding column: vector(768), model gemini-embedding-001.
  // The SDK has no outputDimensionality option yet, so we use Matryoshka truncation:
  // keep the first 768 dims of the 3072-dim embedding and re-normalize.
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent({
    content: { role: 'user', parts: [{ text }] },
    taskType: TaskType.RETRIEVAL_QUERY,
  });
  return normalizeDimensions(result.embedding.values, 768);
}

function normalizeDimensions(values: number[], dim: number): number[] {
  const slice = values.slice(0, dim);
  let norm = Math.sqrt(slice.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) norm = 1;
  return slice.map((v) => v / norm);
}
