'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { Surah } from '@/types/quran';

const SURAH_INDEX_SAMPLE: Surah[] = [
  { id: 1, name_arabic: 'الفاتحة', name_latin: 'Al-Fatihah', translation_id: 'Pembukaan', total_verses: 7, revelation_type: 'meccan' },
  { id: 2, name_arabic: 'البقرة', name_latin: 'Al-Baqarah', translation_id: 'Sapi Betina', total_verses: 286, revelation_type: 'medinan' },
  { id: 3, name_arabic: 'آل عمران', name_latin: "Ali 'Imran", translation_id: 'Keluarga Imran', total_verses: 200, revelation_type: 'medinan' },
  { id: 4, name_arabic: 'النساء', name_latin: "An-Nisa'", translation_id: 'Wanita', total_verses: 176, revelation_type: 'medinan' },
  { id: 5, name_arabic: 'المائدة', name_latin: "Al-Ma'idah", translation_id: 'Hidangan', total_verses: 120, revelation_type: 'medinan' },
  { id: 6, name_arabic: 'الأنعام', name_latin: "Al-An'am", translation_id: 'Hewan Ternak', total_verses: 165, revelation_type: 'meccan' },
  { id: 7, name_arabic: 'الأعراف', name_latin: "Al-A'raf", translation_id: 'Tempat Tertinggi', total_verses: 206, revelation_type: 'meccan' },
  { id: 8, name_arabic: 'الأنفال', name_latin: 'Al-Anfal', translation_id: 'Rampasan Perang', total_verses: 75, revelation_type: 'medinan' },
  { id: 9, name_arabic: 'التوبة', name_latin: 'At-Tawbah', translation_id: 'Pengampunan', total_verses: 129, revelation_type: 'medinan' },
  { id: 10, name_arabic: 'يونس', name_latin: 'Yunus', translation_id: 'Nabi Yunus', total_verses: 109, revelation_type: 'meccan' },
  { id: 13, name_arabic: 'الرعد', name_latin: "Ar-Ra'd", translation_id: 'Guruh', total_verses: 43, revelation_type: 'medinan' },
  { id: 36, name_arabic: 'يس', name_latin: 'Ya-Sin', translation_id: 'Ya Sin', total_verses: 83, revelation_type: 'meccan' },
  { id: 67, name_arabic: 'الملك', name_latin: 'Al-Mulk', translation_id: 'Kerajaan', total_verses: 30, revelation_type: 'meccan' },
  { id: 94, name_arabic: 'الشرح', name_latin: 'Ash-Sharh', translation_id: 'Kelapangan', total_verses: 8, revelation_type: 'meccan' },
  { id: 112, name_arabic: 'الإخلاص', name_latin: 'Al-Ikhlas', translation_id: 'Ikhlas', total_verses: 4, revelation_type: 'meccan' },
  { id: 113, name_arabic: 'الفلق', name_latin: 'Al-Falaq', translation_id: 'Waktu Subuh', total_verses: 5, revelation_type: 'meccan' },
  { id: 114, name_arabic: 'الناس', name_latin: 'An-Nas', translation_id: 'Manusia', total_verses: 6, revelation_type: 'meccan' },
];

export default function QuranIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = SURAH_INDEX_SAMPLE.filter(
    (s) =>
      s.name_latin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.translation_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toString() === searchQuery.trim()
  );

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBE5] text-[#FF5733] text-xs font-bold border border-[#FFCCBD]">
          <BookOpen className="w-4 h-4" />
          <span>114 Surah Al-Qur'an 📖</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#2C1A14]">
          Jelajahi Ayat Suci Al-Qur'an
        </h1>
        <p className="text-sm text-[#7A6358] max-w-xl mx-auto font-medium">
          Temukan keindahan firman Allah dengan terjemahan Kemenag RI & audio tilawah jernih.
        </p>
      </div>

      {/* Search Filter Input */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-5 h-5 text-[#A0887E] absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari surah (contoh: Al-Baqarah, Yasin)..."
          className="w-full cute-card pl-11 pr-4 py-3 text-sm text-[#2C1A14] placeholder-[#A0887E] font-medium focus:outline-none focus:border-[#FF5733]"
        />
      </div>

      {/* Surahs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/quran/${surah.id}`}
            className="cute-card p-4 bg-white hover:border-[#FF5733] transition-all group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEBE5] text-[#FF5733] font-black text-sm flex items-center justify-center border border-[#FFCCBD] group-hover:scale-110 transition-transform">
                {surah.id}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#2C1A14] group-hover:text-[#FF5733] transition-colors flex items-center gap-1">
                  <span>{surah.name_latin}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FF5733] transition-opacity" />
                </h3>
                <p className="text-xs text-[#7A6358] font-medium">
                  {surah.translation_id} • {surah.total_verses} Ayat
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-bold text-[#FF5733] arabic-text">
                {surah.name_arabic}
              </span>
              <span className="block text-[10px] text-[#A0887E] uppercase font-bold">
                {surah.revelation_type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
