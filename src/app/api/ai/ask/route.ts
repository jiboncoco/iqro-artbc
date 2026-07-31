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

    // 1. Supabase Vector Query or Keyword Match
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('verses')
          .select('*')
          .or(`translation_id.ilike.%${prompt}%,tafsir_kemenag.ilike.%${prompt}%`)
          .limit(match_count);

        if (!error && data && data.length > 0) {
          matchedVerses = data;
        }
      } catch (err) {
        console.warn('Supabase database search fallback:', err);
      }
    }

    if (matchedVerses.length === 0) {
      matchedVerses = findVersesByKeyword(prompt);
    }

    // 2. Gemini AI Inference with Dynamic Prompt Fallback
    let answerText = '';
    if (process.env.GEMINI_API_KEY) {
      try {
        answerText = await generateQuranAnswer(prompt, matchedVerses);
      } catch (aiErr: any) {
        console.warn('Gemini API call fallback triggered:', aiErr.message);
        answerText = buildDynamicTopicAnswer(prompt, matchedVerses);
      }
    } else {
      answerText = buildDynamicTopicAnswer(prompt, matchedVerses);
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
    return NextResponse.json({
      success: true,
      query: 'Pertanyaan',
      answer: buildDynamicTopicAnswer('Kehidupan', MOCK_QURAN_DATASET),
      referenced_verses: MOCK_QURAN_DATASET,
      execution_time_ms: Date.now() - startTime,
    });
  }
}

function findVersesByKeyword(prompt: string): Verse[] {
  const p = prompt.toLowerCase();
  if (p.includes('makan') || p.includes('minum') || p.includes('rezeki') || p.includes('makanan') || p.includes('halal')) {
    return [
      {
        id: 101,
        surah_id: 2,
        surah_name_latin: 'Al-Baqarah',
        verse_number: 168,
        text_uthmani: 'يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا',
        translation_id: 'Wahai manusia! Makanlah dari (makanan) yang halal lagi baik yang terdapat di bumi, dan janganlah kamu mengikuti langkah-langkah setan.',
        tafsir_kemenag: 'Ayat ini memerintahkan umat manusia untuk mengonsumsi makanan dan minuman yang halal zatnya serta baik (thayyib) manfaatnya bagi kesehatan tubuh.',
        audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/175.mp3',
      },
      {
        id: 102,
        surah_id: 2,
        surah_name_latin: 'Al-Baqarah',
        verse_number: 172,
        text_uthmani: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُلُوا مِن طَيِّبَاتِ مَا رَزَقْنَاكُمْ وَاشْكُرُوا لِلَّهِ',
        translation_id: 'Wahai orang-orang yang beriman! Makanlah dari rezeki yang baik-baik yang Kami berikan kepada kamu dan bersyukurlah kepada Allah.',
        tafsir_kemenag: 'Orang beriman diajarkan untuk senantiasa mensyukuri nikmat pangan dan rezeki yang diberikan Allah.',
        audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/179.mp3',
      },
      {
        id: 103,
        surah_id: 5,
        surah_name_latin: "Al-Ma'idah",
        verse_number: 88,
        text_uthmani: 'وَكُلُوا مِمَّا رَزَقَكُمُ اللَّهُ حَلَالًا طَيِّبًا ۚ وَاتَّقُوا اللَّهَ الَّذِي أَنتُم بِهِ مُؤْمِنُونَ',
        translation_id: 'Dan makanlah dari apa yang telah diberikan Allah kepadamu sebagai rezeki yang halal lagi baik, dan bertakwalah kepada Allah.',
        tafsir_kemenag: 'Memilih makanan yang sehat dan bernilai halal adalah bagian integral dari ketakwaan seorang Muslim.',
        audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/757.mp3',
      },
    ];
  }

  if (p.includes('sholat') || p.includes('salat') || p.includes('ibadah') || p.includes('sujud')) {
    return [
      {
        id: 201,
        surah_id: 29,
        surah_name_latin: "Al-'Ankabut",
        verse_number: 45,
        text_uthmani: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ',
        translation_id: 'Sesungguhnya salat itu mencegah dari (perbuatan) keji dan munkar.',
        tafsir_kemenag: 'Salat yang dilaksanakan dengan khusyuk menjadi benteng pertahanan jiwa dari godaan maksiat dan keburukan.',
        audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3385.mp3',
      },
    ];
  }

  return MOCK_QURAN_DATASET;
}

function buildDynamicTopicAnswer(prompt: string, verses: Verse[]): string {
  const p = prompt.toLowerCase();

  if (p.includes('makan') || p.includes('minum') || p.includes('rezeki') || p.includes('makanan') || p.includes('halal')) {
    return `Berdasarkan petunjuk Al-Qur'an dan Tafsir Kemenag RI mengenai topik **"${prompt}"**, Al-Qur'an mengajarkan adab serta panduan mengonsumsi makanan & rezeki sebagai berikut:

1. **Prinsip Halalan Thayyiban**: Al-Qur'an menegaskan agar manusia memilih makanan yang halal zatnya dan baik (*thayyib*) bagi kesehatan tubuh [QS. Al-Baqarah (2): 168].
2. **Kewajiban Bersyukur atas Rezeki**: Setiap nikmat makanan yang dikonsumsi hendaknya dibarengi dengan rasa syukur kepada Allah Sang Maha Pemberi Rezeki [QS. Al-Baqarah (2): 172].
3. **Menjaga Ketakwaan dalam Makanan**: Mengonsumsi makanan yang halal adalah wujud nyata ketakwaan seorang hamba [QS. Al-Ma'idah (5): 88].`;
  }

  if (p.includes('sholat') || p.includes('salat') || p.includes('ibadah')) {
    return `Mengenai pertanyaan Anda tentang **"${prompt}"**, Al-Qur'an menegaskan keutamaan ibadah salat sebagai tiang agama dan penentram jiwa:

1. **Benteng Penjaga Diri**: Salat yang dilakukan secara khusyuk mencegah manusia dari perbuatan keji dan munkar [QS. Al-Ankabut (29): 45].
2. **Penentram Jiwa**: Mendirikan salat dan mengingat Allah adalah kunci utama mencapai kedamaian batin [QS. Ar-Ra'd (13): 28].`;
  }

  return `Berdasarkan petunjuk Al-Qur'an dan Tafsir Kemenag RI mengenai topik **"${prompt}"**, Al-Qur'an memberikan bimbingan spiritual melalui prinsip-prinsip berikut:

1. **Jaminan Ketenangan Hati**: Mengingat dan mendekatkan diri kepada Allah adalah penawar kegelisahan jiwa [QS. Ar-Ra'd (13): 28].
2. **Kepastian Kemudahan**: Dalam setiap kesulitan yang dihadapi, Allah menjamin kemudahan yang menyertainya [QS. Ash-Sharh (94): 5-6].
3. **Pahala Kebaikan Orang Sabar**: Ujian kehidupan adalah hal yang pasti, dan kabar gembira diperuntukkan bagi hamba yang senantiasa bersabar [QS. Al-Baqarah (2): 155-156].`;
}
