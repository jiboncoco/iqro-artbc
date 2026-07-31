'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { useBookmarkStore } from '@/store/useBookmarkStore';

export default function BookmarksHistoryPage() {
  const { bookmarks, removeBookmark } = useBookmarkStore();

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBE5] text-[#FF5733] text-xs font-bold border border-[#FFCCBD]">
          <Bookmark className="w-4 h-4" />
          <span>Ayat Pilihan Saya 💖</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#2C1A14]">
          Daftar Bookmark Ayat
        </h1>
        <p className="text-sm text-[#7A6358] max-w-xl mx-auto font-medium">
          Kelola ayat-ayat Al-Qur'an favorit yang telah Anda simpan.
        </p>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="cute-card p-12 text-center bg-white space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFEBE5] text-[#FF5733] flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-[#2C1A14]">Belum Ada Bookmark</h3>
          <p className="text-xs text-[#7A6358] font-medium">
            Simpan ayat Al-Qur'an pilihan Anda dengan menekan ikon bookmark saat membaca Al-Qur'an.
          </p>
          <Link
            href="/quran"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF5733] text-white text-xs font-bold hover:bg-[#E64A19] transition-all"
          >
            <span>Mulai Baca Al-Qur'an</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {bookmarks.map((item) => (
            <div
              key={item.id}
              className="cute-card p-5 bg-white flex items-center justify-between border-2 border-[#F0E3D5]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEBE5] text-[#FF5733] font-bold text-xs flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C1A14]">
                    {item.surah_name_latin}
                  </h4>
                  <p className="text-xs text-[#7A6358] font-medium">
                    Ayat Ke-{item.verse_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/quran/${item.surah_id}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#FF5733] text-white text-xs font-bold hover:bg-[#E64A19] transition-all"
                >
                  Baca
                </Link>
                <button
                  onClick={() => removeBookmark(item.surah_id, item.verse_number)}
                  className="p-1.5 rounded-full text-[#7A6358] hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Hapus Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
