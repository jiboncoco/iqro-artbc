'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Bookmark as BookmarkIcon, BookOpen, Volume2, Type, Info, Loader2 } from 'lucide-react';
import { Verse } from '@/types/quran';
import { fetchSurahVerses } from '@/lib/quran/fetcher';
import { ALL_114_SURAHS } from '@/lib/quran/surahs';
import { useAudioStore } from '@/store/useAudioStore';
import { useBookmarkStore } from '@/store/useBookmarkStore';
import { TafsirModal } from '@/components/quran/TafsirModal';

export default function SurahDetailPage({ params }: { params: Promise<{ surahId: string }> }) {
  const resolvedParams = React.use(params);
  const surahIdNum = parseInt(resolvedParams.surahId, 10) || 1;

  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [selectedTafsirVerse, setSelectedTafsirVerse] = useState<Verse | null>(null);

  const { playVerse } = useAudioStore();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();

  const currentSurahMeta = ALL_114_SURAHS.find((s) => s.id === surahIdNum) || {
    id: surahIdNum,
    name_latin: `Surah ${surahIdNum}`,
    name_arabic: '',
    translation_id: '',
    total_verses: 0,
    revelation_type: 'meccan',
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchSurahVerses(surahIdNum).then((data) => {
      if (isMounted) {
        setVerses(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [surahIdNum]);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-xl sm:text-2xl';
      case 'lg':
        return 'text-3xl sm:text-4xl';
      default:
        return 'text-2xl sm:text-3xl';
    }
  };

  const handleBookmarkToggle = (verse: Verse) => {
    if (isBookmarked(verse.surah_id, verse.verse_number)) {
      removeBookmark(verse.surah_id, verse.verse_number);
    } else {
      addBookmark({
        surah_id: verse.surah_id,
        surah_name_latin: currentSurahMeta.name_latin,
        verse_number: verse.verse_number,
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/quran"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white text-[#2C1A14] border border-[#F0E3D5] hover:border-[#FF5733] hover:text-[#FF5733] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Surah</span>
        </Link>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1.5 cute-card px-3 py-1.5 bg-white border border-[#F0E3D5]">
          <Type className="w-4 h-4 text-[#7A6358]" />
          <button
            onClick={() => setFontSize('sm')}
            className={`px-2 py-0.5 text-xs font-bold rounded-md ${fontSize === 'sm' ? 'bg-[#FF5733] text-white' : 'text-[#7A6358]'}`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('md')}
            className={`px-2 py-0.5 text-xs font-bold rounded-md ${fontSize === 'md' ? 'bg-[#FF5733] text-white' : 'text-[#7A6358]'}`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize('lg')}
            className={`px-2 py-0.5 text-xs font-bold rounded-md ${fontSize === 'lg' ? 'bg-[#FF5733] text-white' : 'text-[#7A6358]'}`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Surah Header Card */}
      <div className="cute-gradient-header p-6 sm:p-8 rounded-3xl text-center space-y-2 shadow-lg">
        <span className="cute-badge px-3.5 py-1 text-xs bg-white/20 text-white border-white/30">
          Surah Ke-{surahIdNum} • {currentSurahMeta.total_verses || verses.length} Ayat
        </span>
        <h1 className="text-3xl font-black text-white flex items-center justify-center gap-3">
          <span>Surah {currentSurahMeta.name_latin}</span>
          <span className="arabic-text text-amber-200">{currentSurahMeta.name_arabic}</span>
        </h1>
        <p className="text-xs text-orange-100 font-medium">
          Bismillahir Rahmanir Rahim • Terjemahan Kemenag RI ({currentSurahMeta.revelation_type.toUpperCase()})
        </p>
      </div>

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="cute-card p-12 text-center bg-white space-y-3">
          <Loader2 className="w-8 h-8 text-[#FF5733] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#7A6358]">Memuat seluruh ayat Surah {currentSurahMeta.name_latin}...</p>
        </div>
      ) : (
        /* Verses List */
        <div className="space-y-4">
          {verses.map((verse, idx) => {
            const bookmarked = isBookmarked(verse.surah_id, verse.verse_number);

            return (
              <div
                key={idx}
                className="cute-card p-6 bg-white space-y-4 border-2 border-[#F0E3D5]"
              >
                {/* Verse Action Bar */}
                <div className="flex items-center justify-between border-b border-[#F0E3D5] pb-3">
                  <span className="cute-badge px-3 py-1 text-xs">
                    Ayat {verse.verse_number}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Play Audio */}
                    {verse.audio_url && (
                      <button
                        onClick={() => playVerse(verse)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFEBE5] text-[#FF5733] hover:bg-[#FF5733] hover:text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Audio</span>
                      </button>
                    )}

                    {/* Open Tafsir Modal */}
                    <button
                      onClick={() => setSelectedTafsirVerse(verse)}
                      className="p-1.5 rounded-full text-[#7A6358] hover:text-[#FF5733] hover:bg-[#FFEBE5] transition-colors cursor-pointer"
                      title="Baca Tafsir"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleBookmarkToggle(verse)}
                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                        bookmarked
                          ? 'text-[#FF5733] bg-[#FFEBE5]'
                          : 'text-[#7A6358] hover:text-[#FF5733] hover:bg-[#FFEBE5]'
                      }`}
                      title={bookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}
                    >
                      <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className={`text-right font-bold text-[#2C1A14] arabic-text py-2 ${getFontSizeClass()}`}>
                  {verse.text_uthmani}
                </div>

                {/* Translation */}
                <p className="text-sm text-[#523A30] font-medium leading-relaxed italic bg-[#FAF4EC] p-3.5 rounded-xl border border-[#F0E3D5]">
                  "{verse.translation_id}"
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tafsir Modal */}
      <TafsirModal
        verse={selectedTafsirVerse}
        onClose={() => setSelectedTafsirVerse(null)}
      />
    </div>
  );
}
