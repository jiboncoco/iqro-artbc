import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Bookmark } from '@/types/quran';

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'created_at'>) => void;
  removeBookmark: (surahId: number, verseNumber: number) => void;
  isBookmarked: (surahId: number, verseNumber: number) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (item) => {
        const exists = get().bookmarks.some(
          (b) => b.surah_id === item.surah_id && b.verse_number === item.verse_number
        );
        if (!exists) {
          const newBookmark: Bookmark = {
            ...item,
            id: `${item.surah_id}:${item.verse_number}`,
            created_at: new Date().toISOString(),
          };
          set({ bookmarks: [newBookmark, ...get().bookmarks] });
        }
      },
      removeBookmark: (surahId, verseNumber) => {
        set({
          bookmarks: get().bookmarks.filter(
            (b) => !(b.surah_id === surahId && b.verse_number === verseNumber)
          ),
        });
      },
      isBookmarked: (surahId, verseNumber) => {
        return get().bookmarks.some(
          (b) => b.surah_id === surahId && b.verse_number === verseNumber
        );
      },
    }),
    {
      name: 'iqro-bookmarks-storage',
    }
  )
);
