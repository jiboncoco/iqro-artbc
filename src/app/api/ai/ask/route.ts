import { NextRequest, NextResponse } from 'next/server';
import { generateQuranAnswer, generateQueryEmbedding } from '@/lib/gemini/client';
import { supabase, MOCK_QURAN_DATASET } from '@/lib/supabase/client';
import { Verse } from '@/types/quran';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { prompt, match_count = 5 } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Pertanyaan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    let matchedVerses: Verse[] = [];

    // 1. Vector Search Attempt via Supabase pgvector if credentials present
    if (supabase && process.env.GEMINI_API_KEY) {
      try {
        const queryEmbedding = await generateQueryEmbedding(prompt);
        const { data, error } = await supabase.rpc('match_verses', {
          query_embedding: queryEmbedding,
          match_threshold: 0.4,
          match_count: match_count,
        });

        if (!error && data && data.length > 0) {
          matchedVerses = data;
        }
      } catch (err) {
        console.warn('Vector search fallback to curated dataset:', err);
      }
    }

    // 2. Fallback to curated dataset for demo/offline preview if zero results
    if (matchedVerses.length === 0) {
      matchedVerses = MOCK_QURAN_DATASET;
    }

    // 3. Run Gemini RAG Inference
    let answerText = '';
    if (process.env.GEMINI_API_KEY) {
      answerText = await generateQuranAnswer(prompt, matchedVerses);
    } else {
      // Graceful fallback response when API Key is pending
      answerText = `[Demo Mode - Konfigurasi GEMINI_API_KEY]
Berdasarkan rujukan Al-Qur'an, untuk pertanyaan "${prompt}", Al-Qur'an memberikan ketenangan dan petunjuk melalui ayat-ayat berikut:

1. **Jaminan Ketenangan Hati**: Mengingat Allah adalah penawar kegelisahan dan kecemasan jiwa [QS. Ar-Ra'd (13): 28].
2. **Kepastian Kemudahan**: Dalam setiap kesulitan yang dihadapi, Allah telah menyiapkan kemudahan bersamanya [QS. Ash-Sharh (94): 5-6].
3. **Pahala Bagi Orang Sabar**: Ujian kehidupan adalah keniscayaan, dan kabar gembira diperuntukkan bagi hamba yang sabar [QS. Al-Baqarah (2): 155-156].`;
    }

    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      query: prompt,
      answer: answerText,
      referenced_verses: matchedVerses,
      execution_time_ms: executionTimeMs,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Terjadi kesalahan sistem saat memproses AI.',
      },
      { status: 500 }
    );
  }
}
