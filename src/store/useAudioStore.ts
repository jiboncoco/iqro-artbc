import { create } from 'zustand';
import { Verse } from '@/types/quran';

interface AudioStore {
  currentVerse: Verse | null;
  isPlaying: boolean;
  playVerse: (verse: Verse) => void;
  pauseAudio: () => void;
  togglePlay: () => void;
  clearAudio: () => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  currentVerse: null,
  isPlaying: false,
  playVerse: (verse: Verse) => {
    set({ currentVerse: verse, isPlaying: true });
  },
  pauseAudio: () => {
    set({ isPlaying: false });
  },
  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },
  clearAudio: () => {
    set({ currentVerse: null, isPlaying: false });
  },
}));
