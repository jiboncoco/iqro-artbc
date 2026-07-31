import { createClient } from '@supabase/supabase-js';
import { Verse } from '@/types/quran';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock Fallback Vector Matching for local development/demonstration if Supabase credentials aren't set up yet
export const MOCK_QURAN_DATASET: Verse[] = [
  {
    id: 1,
    surah_id: 2,
    surah_name_latin: 'Al-Baqarah',
    verse_number: 155,
    text_uthmani: 'وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ',
    translation_id: 'Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan, kekurangan harta, jiwa, dan buah-buahan. Dan sampaikanlah kabar gembira kepada orang-orang yang sabar.',
    tafsir_kemenag: 'Ayat ini menegaskan bahwa ujian kehidupan dalam bentuk rasa takut, kesulitan ekonomi, maupun kehilangan adalah kepastian. Kuncinya adalah bersabar.',
    audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/162.mp3',
  },
  {
    id: 2,
    surah_id: 2,
    surah_name_latin: 'Al-Baqarah',
    verse_number: 156,
    text_uthmani: 'الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    translation_id: '(yaitu) orang-orang yang apabila ditimpa musibah, mereka berkata: "Inna lillahi wa inna ilaihi raji\'un" (Sesungguhnya kami milik Allah dan kepada-Nyalah kami kembali).',
    tafsir_kemenag: 'Kalimat istirja memberikan kedamaian jiwa bahwa segala sesuatu di dunia hanyalah titipan Allah.',
    audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/163.mp3',
  },
  {
    id: 3,
    surah_id: 13,
    surah_name_latin: 'Ar-Ra\'d',
    verse_number: 28,
    text_uthmani: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation_id: '(yaitu) orang-orang yang beriman dan hati mereka menjadi tenteram dengan mengingat Allah. Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.',
    tafsir_kemenag: 'Zikrullah adalah obat paling mujarab untuk menghilangkan kecemasan, kegelisahan, dan ketakutan.',
    audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1735.mp3',
  },
  {
    id: 4,
    surah_id: 94,
    surah_name_latin: 'Ash-Sharh',
    verse_number: 5,
    text_uthmani: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation_id: 'Maka sesungguhnya bersama kesulitan ada kemudahan,',
    tafsir_kemenag: 'Janji pasti Allah bahwa kesulitan tidak akan berlangsung selamanya, pasti menyertai kemudahan.',
    audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6095.mp3',
  },
  {
    id: 5,
    surah_id: 94,
    surah_name_latin: 'Ash-Sharh',
    verse_number: 6,
    text_uthmani: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation_id: 'sesungguhnya bersama kesulitan ada kemudahan.',
    tafsir_kemenag: 'Pengulangan tegas dari Allah untuk memperkuat optimisme seorang hamba.',
    audio_url: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6096.mp3',
  },
];
