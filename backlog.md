# 📌 Project Backlog - IQRO

**Project Name:** IQRO  
**Domain Target:** `iqro.artbycode.id`  
**Methodology:** Agile / Scrum Sprints  

---

## 🚀 Epic 1: Project Setup & Core Infrastructure (Sprint 1)
- [x] **TASK-101**: Setup Repository Next.js 15 (App Router, TypeScript, Tailwind CSS v4).
- [x] **TASK-102**: Inisialisasi Supabase Client & Mock Dataset Fallback (`src/lib/supabase/client.ts`).
- [x] **TASK-103**: Inisialisasi Google GenAI SDK (`@google/generative-ai`) dan utility embedding `text-embedding-004` & `gemini-1.5-flash`.
- [x] **TASK-104**: Konfigurasi PWA 2.0 Web App Manifest (`public/manifest.json`) & Next-PWA Setup.

---

## 🤖 Epic 2: AI Quran Assistant & RAG Pipeline (Sprint 2)
- [x] **TASK-201**: Buat Prompt Engineering & System Instructions Template (`src/lib/gemini/prompts.ts`).
- [x] **TASK-202**: Buat Serverless Route `/api/ai/ask` (Vector Retrieval + Gemini 1.5 Flash Execution).
- [x] **TASK-203**: Buat UI Interface AI Assistant (`src/components/ai/AIChatInterface.tsx` dengan Recommended Prompts, Response Card, & Verse Cards).

---

## 📖 Epic 3: Quran Reader & Audio Player (Sprint 3)
- [x] **TASK-301**: Buat Halaman Index Surah (`src/app/quran/page.tsx`) dengan fitur pencarian dan filter.
- [x] **TASK-302**: Buat Global Audio Player Bar (`src/components/quran/AudioPlayerBar.tsx` & Zustand Audio Store).
- [x] **TASK-303**: Buat Detail View Surah (`src/app/quran/[surahId]/page.tsx` untuk Teks Uthmani, Terjemahan Kemenag, Transliterasi, & Pengaturan Ukuran Font).
- [x] **TASK-304**: Buat Tafsir Drawer/Modal (`src/components/quran/TafsirModal.tsx` Tafsir Kemenag per ayat).

---

## 📱 Epic 4: PWA 2.0 Capabilities & Offline Suite (Sprint 4)
- [x] **TASK-401**: Konfigurasi `@ducanh2912/next-pwa` dan `manifest.json` (Standalone display, app icons, theme color).
- [x] **TASK-402**: Generate Ikon PWA 192x192 & 512x512 (`public/icons/`).
- [x] **TASK-403**: Implementasi Custom PWA Install Prompt Component di Navbar (`src/components/layout/Navbar.tsx`).
- [x] **TASK-404**: Konfigurasi CacheStorage & Service Worker (`public/sw.js`) untuk membaca Al-Qur'an secara luring (Offline Mode).

---

## 🎨 Epic 5: UX Polish, Bookmark & History (Sprint 5)
- [x] **TASK-501**: Implementasi Simpan Bookmark Ayat (`src/store/useBookmarkStore.ts` & LocalStorage sync).
- [x] **TASK-502**: Halaman Bookmark & Riwayat (`src/app/history/page.tsx`).
- [x] **TASK-503**: Polishing UI/UX Ceria & Lucu (Aksen Coral Sunset & Warm Cream inspired by user designs).
- [x] **TASK-504**: Production Build & Validation (`npm run build` PASSED - 0 Errors).
