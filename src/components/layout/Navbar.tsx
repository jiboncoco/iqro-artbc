'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, BookOpen, Download, Bookmark } from 'lucide-react';

export function Navbar() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF4EC]/90 backdrop-blur-md border-b border-[#F0E3D5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Playful Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5733] to-[#FF8A65] p-1 shadow-md group-hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full bg-[#FFF9F2] rounded-[12px] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#FF5733] arabic-text">
                اقرأ
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-[#2C1A14]">
                IQRO
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEBE5] text-[#FF5733] border border-[#FFCCBD]">
                PWA 2.0
              </span>
            </div>
            <p className="text-xs font-medium text-[#7A6358]">AI Qur'an & Companion ✨</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-bold text-[#3D271D] bg-[#FFF9F2] border border-[#F0E3D5] hover:border-[#FF5733] hover:text-[#FF5733] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#FF5733]" />
            <span className="hidden sm:inline">Tanya AI</span>
          </Link>

          <Link
            href="/quran"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-bold text-[#3D271D] bg-[#FFF9F2] border border-[#F0E3D5] hover:border-[#FF5733] hover:text-[#FF5733] transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#FF5733]" />
            <span className="hidden sm:inline">Al-Qur'an</span>
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-bold text-[#3D271D] bg-[#FFF9F2] border border-[#F0E3D5] hover:border-[#FF5733] hover:text-[#FF5733] transition-all"
          >
            <Bookmark className="w-4 h-4 text-[#FF5733]" />
            <span className="hidden sm:inline">Bookmark</span>
          </Link>

          {/* Install PWA Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#FF5733] hover:bg-[#E64A19] text-white shadow-md playful-shadow transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
