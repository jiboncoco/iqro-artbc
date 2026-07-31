'use client';

import React, { useRef, useEffect } from 'react';
import { useAudioStore } from '@/store/useAudioStore';
import { Play, Pause, X, Music } from 'lucide-react';

export function AudioPlayerBar() {
  const { currentVerse, isPlaying, togglePlay, clearAudio } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play blocked:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentVerse]);

  if (!currentVerse) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 bg-white border-2 border-[#FFD5C6] rounded-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Audio Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-[#FFEBE5] text-[#FF5733] flex items-center justify-center shrink-0 border border-[#FFCCBD] shadow-sm">
            <Music className="w-5 h-5 animate-pulse" />
          </div>
          <div className="truncate">
            <h4 className="text-sm font-extrabold text-[#2C1A14] truncate">
              {currentVerse.surah_name_latin || `Surah ${currentVerse.surah_id}`} : Ayat {currentVerse.verse_number}
            </h4>
            <p className="text-xs text-[#7A6358] font-medium truncate">Mishary Rashid Alafasy 🎧</p>
          </div>
        </div>

        {/* Audio Element */}
        {currentVerse.audio_url && (
          <audio
            ref={audioRef}
            src={currentVerse.audio_url}
            onEnded={clearAudio}
          />
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FF5733] text-white flex items-center justify-center hover:bg-[#E64A19] shadow-md transition-transform hover:scale-105 cursor-pointer"
            aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={clearAudio}
            className="p-2 rounded-full text-[#7A6358] hover:text-[#2C1A14] hover:bg-[#FFEBE5] transition-colors cursor-pointer"
            aria-label="Close Audio Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
