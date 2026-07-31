export interface Surah {
  id: number;
  name_arabic: string;
  name_latin: string;
  translation_id: string;
  total_verses: number;
  revelation_type: 'meccan' | 'medinan';
  audio_url?: string;
}

export interface Verse {
  id?: number;
  surah_id: number;
  surah_name_latin?: string;
  verse_number: number;
  text_uthmani: string;
  text_latin?: string;
  translation_id: string;
  tafsir_kemenag?: string;
  audio_url?: string;
  similarity_score?: number;
}

export interface Bookmark {
  id: string;
  surah_id: number;
  surah_name_latin: string;
  verse_number: number;
  created_at: string;
}
