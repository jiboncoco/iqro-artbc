'use client';

import React, { useState } from 'react';
import { Sparkles, Send, BookOpen, Play, Heart, Smile, MessageCircle, HelpCircle, Check } from 'lucide-react';
import { RecommendedPrompt, AskAIResponse } from '@/types/ai';
import { Verse } from '@/types/quran';
import { useAudioStore } from '@/store/useAudioStore';

const RECOMMENDED_PROMPTS: RecommendedPrompt[] = [
  {
    id: '1',
    title: '🌿 Mengatasi Kecemasan & Gelisah',
    prompt: 'Bagaimana Al-Qur\'an mengajarkan kita untuk mengatasi kecemasan dan memperoleh ketenangan hati?',
    category: 'Ketenangan Hati',
  },
  {
    id: '2',
    title: '⚡ Sabar Menghadapi Ujian',
    prompt: 'Apa sajakah petunjuk Al-Qur\'an ketika seseorang sedang menghadapi ujian hidup yang berat?',
    category: 'Sabar & Ujian',
  },
  {
    id: '3',
    title: '💼 Prinsip Kejujuran Bisnis',
    prompt: 'Bagaimana prinsip etika, kejujuran, dan keadilan berbisnis dalam Al-Qur\'an?',
    category: 'Kehidupan & Bisnis',
  },
  {
    id: '4',
    title: '💖 Berbakti Kepada Orang Tua',
    prompt: 'Bagaimana Al-Qur\'an memerintahkan kita untuk bersikap mulia kepada kedua orang tua?',
    category: 'Keluarga',
  },
];

export function AIChatInterface() {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AskAIResponse | null>(null);
  const { playVerse } = useAudioStore();

  const handleAskAI = async (queryText?: string) => {
    const finalPrompt = queryText || promptInput;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data: AskAIResponse = await res.json();
      setAiResponse(data);
    } catch (error) {
      console.error('Failed to query AI:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Playful Sunset Header Hero */}
      <div className="cute-gradient-header p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden text-center space-y-3">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30">
          <Smile className="w-4 h-4 text-amber-200" />
          <span>Assalamu'alaikum! Yuk Tanya Al-Qur'an 🌸</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Apa yang Sedang Kamu Pikirkan Hari Ini?
        </h1>
        <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto font-medium">
          Tuliskan pertanyaan kehidupanmu, dan biarkan AI Gemini mencarikan petunjuk adem dari Al-Qur'an & Tafsir Kemenag.
        </p>
      </div>

      {/* Input Box - Warm Soft Card */}
      <div className="cute-card p-3 rounded-3xl bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
            placeholder="Ketik pertanyaanmu di sini... (contoh: Cara mengatasi rasa takut gagal)"
            className="w-full bg-transparent px-4 py-3 text-sm sm:text-base text-[#2C1A14] placeholder-[#A0887E] font-medium focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={() => handleAskAI()}
            disabled={isLoading || !promptInput.trim()}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FF5733] hover:bg-[#E64A19] text-white font-extrabold text-sm shadow-md playful-shadow hover:scale-105 disabled:opacity-50 transition-all shrink-0"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Cari Petunjuk</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommended Prompts Grid - Editorial Card Style (Image 1 & 2) */}
      {!aiResponse && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-[#7A6358] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF5733]" />
              <span>Inspirasi Pertanyaan Pilihan</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RECOMMENDED_PROMPTS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setPromptInput(item.prompt);
                  handleAskAI(item.prompt);
                }}
                className="text-left cute-card p-5 bg-white hover:border-[#FF5733] group space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="cute-badge px-3 py-1 text-[11px]">
                    {item.category}
                  </span>
                  <HelpCircle className="w-4 h-4 text-[#C2A69A] group-hover:text-[#FF5733] transition-colors" />
                </div>
                <h4 className="text-base font-extrabold text-[#2C1A14] group-hover:text-[#FF5733] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#7A6358] leading-relaxed font-medium">
                  "{item.prompt}"
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Answer & Referenced Verse Cards */}
      {aiResponse && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Post Card Style AI Response (Inspired by Image 1) */}
          <div className="cute-card p-6 sm:p-8 bg-white border-2 border-[#FFD5C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E3D5] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFEBE5] flex items-center justify-center text-[#FF5733]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#2C1A14]">IQRO AI Companion</h4>
                  <p className="text-[10px] font-semibold text-[#7A6358]">Gemini 1.5 Flash Grounded Answer</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#E64A19] bg-[#FFEBE5] px-2.5 py-1 rounded-full">
                ⚡ {aiResponse.execution_time_ms}ms
              </span>
            </div>

            <div className="text-[#3D271D] text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
              {aiResponse.answer}
            </div>
          </div>

          {/* Referenced Verses */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#2C1A14] flex items-center gap-2 px-1">
              <BookOpen className="w-5 h-5 text-[#FF5733]" />
              <span>Ayat Al-Qur'an Rujukan ({aiResponse.referenced_verses.length})</span>
            </h3>

            <div className="space-y-4">
              {aiResponse.referenced_verses.map((verse, idx) => (
                <div
                  key={idx}
                  className="cute-card p-6 bg-white space-y-4 border-2 border-[#F0E3D5]"
                >
                  <div className="flex items-center justify-between border-b border-[#F0E3D5] pb-3">
                    <span className="cute-badge px-3 py-1 text-xs">
                      QS. {verse.surah_name_latin || `Surah ${verse.surah_id}`} : Ayat {verse.verse_number}
                    </span>
                    {verse.audio_url && (
                      <button
                        onClick={() => playVerse(verse)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF5733] text-white hover:bg-[#E64A19] text-xs font-extrabold shadow-sm transition-transform hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Tilawah</span>
                      </button>
                    )}
                  </div>

                  {/* Arabic Text */}
                  <div className="text-right text-2xl sm:text-3xl font-bold text-[#2C1A14] arabic-text py-2">
                    {verse.text_uthmani}
                  </div>

                  {/* Indonesian Translation */}
                  <p className="text-sm text-[#523A30] font-medium leading-relaxed italic bg-[#FAF4EC] p-3.5 rounded-xl border border-[#F0E3D5]">
                    "{verse.translation_id}"
                  </p>

                  {/* Tafsir Snippet */}
                  {verse.tafsir_kemenag && (
                    <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#F0E3D5] text-xs text-[#7A6358] space-y-1">
                      <div className="font-bold text-[#3D271D]">
                        📖 Tafsir Kemenag RI:
                      </div>
                      <p className="leading-relaxed font-medium">{verse.tafsir_kemenag}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
