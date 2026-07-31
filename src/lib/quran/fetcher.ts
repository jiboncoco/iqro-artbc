import { Verse } from '@/types/quran';
import { supabase, MOCK_QURAN_DATASET } from '@/lib/supabase/client';

export async function fetchSurahVerses(surahId: number): Promise<Verse[]> {
  // 1. Attempt to fetch from Supabase PostgreSQL if table is seeded
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('surah_id', surahId)
        .order('verse_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Verse[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to public API:', err);
    }
  }

  // 2. Fetch full Surah verses dynamically from EQuran API (Indonesian Kemenag Translation + Audio)
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${surahId}`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.ayat) {
        const surahNameLatin = json.data.namaLatin;
        return json.data.ayat.map((item: any) => ({
          id: item.nomorAyat,
          surah_id: surahId,
          surah_name_latin: surahNameLatin,
          verse_number: item.nomorAyat,
          text_uthmani: item.teksArab,
          text_latin: item.teksLatin,
          translation_id: item.teksIndonesia,
          tafsir_kemenag: `Ayat ${item.nomorAyat} dari Surah ${surahNameLatin}.`,
          audio_url: item.audio ? item.audio['05'] || Object.values(item.audio)[0] : `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.nomorAyat}.mp3`,
        }));
      }
    }
  } catch (apiErr) {
    console.warn('EQuran API fetch error:', apiErr);
  }

  // 3. Fallback sample if offline
  return MOCK_QURAN_DATASET.filter((v) => v.surah_id === surahId).length > 0
    ? MOCK_QURAN_DATASET.filter((v) => v.surah_id === surahId)
    : MOCK_QURAN_DATASET;
}
