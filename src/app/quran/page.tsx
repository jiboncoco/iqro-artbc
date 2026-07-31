'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { ALL_114_SURAHS } from '@/lib/quran/surahs';

export default function QuranIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = ALL_114_SURAHS.filter(
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
