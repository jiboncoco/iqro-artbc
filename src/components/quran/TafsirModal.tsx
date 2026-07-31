'use client';

import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { Verse } from '@/types/quran';

interface TafsirModalProps {
  verse: Verse | null;
  onClose: () => void;
}

export function TafsirModal({ verse, onClose }: TafsirModalProps) {
  if (!verse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="cute-card w-full max-w-xl bg-white p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-[#FFD5C6]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F0E3D5] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFEBE5] text-[#FF5733] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2C1A14]">
                Tafsir Kemenag RI
              </h3>
              <p className="text-xs font-bold text-[#FF5733]">
                QS. {verse.surah_name_latin || `Surah ${verse.surah_id}`} : Ayat {verse.verse_number}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7A6358] hover:text-[#2C1A14] hover:bg-[#FFEBE5] transition-colors cursor-pointer"
            aria-label="Tutup Tafsir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verse Preview */}
        <div className="p-4 rounded-2xl bg-[#FAF4EC] space-y-3 border border-[#F0E3D5]">
          <div className="text-right text-2xl font-bold text-[#2C1A14] arabic-text">
            {verse.text_uthmani}
          </div>
          <p className="text-xs text-[#523A30] font-medium italic">
            "{verse.translation_id}"
          </p>
        </div>

        {/* Tafsir Content */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-[#7A6358] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5733]" />
            <span>Penjelasan & Content Tafsir</span>
          </h4>
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F0E3D5] text-sm text-[#3D271D] leading-relaxed font-medium">
            {verse.tafsir_kemenag ||
              'Tafsir ringkas Kemenag RI memberikan perenungan bahwa setiap ayat Al-Qur\'an mengandung hikmah mendalam bagi kehidupan hamba Allah yang beriman dan bertakwa.'}
          </div>
        </div>
      </div>
    </div>
  );
}
