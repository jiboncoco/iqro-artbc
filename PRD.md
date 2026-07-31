# 📋 Product Requirements Document (PRD) - IQRO

**Project Name:** IQRO  
**Domain:** `iqro.artbycode.id`  
**Platform Target:** Progressive Web App (PWA 2.0) - Cross Platform (Android, iOS, iPadOS, macOS, Windows, Linux)  
**Deployment:** Vercel (Edge & Serverless Infrastructure)  
**Version:** 1.0.0-MVP  
**Status:** Approved & Ready for Technical Implementation  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**IQRO** adalah aplikasi web generasi baru (PWA 2.0) yang menggabungkan kemudahan membaca dan mendengarkan Al-Qur'an dengan kecanggihan AI (Google Gemini) yang terintegrasi dengan metode *Retrieval-Augmented Generation* (RAG). Pengguna dapat menanyakan konteks kehidupan, problematika sehari-hari, maupun pertanyaan keislaman, dan sistem akan mencarikan korelasi serta penjelasan berdasarkan ayat-ayat Al-Qur'an dan tafsir Kemenag RI secara presisi, akurat, dan akuntabel.

### 1.2 Target Audience
1. **Masyarakat Umum / Umat Muslim**: Yang membutuhkan jawaban atau ketenangan spiritual berbasis rujukan Al-Qur'an atas pertanyaan kehidupan sehari-hari.
2. **Pelajar / Mahasiswa / Akademisi**: Yang ingin melakukan pencarian tematik (*Maudhu'i*) ayat Al-Qur'an secara cepat dan relevan.
3. **Pengguna Mobile & Desktop**: Yang menginginkan pengalaman aplikasi native tanpa perlu mendownload file besar dari App Store/Play Store (cukup install PWA 2.0).

---

## 2. High-Level Requirements & Strategic Goals

| ID | Goal / Requirement | Description | Target Standard |
| :--- | :--- | :--- | :--- |
| **REQ-01** | **PWA 2.0 Compliance** | Dapat diinstall di Android, iOS/iPadOS, Windows, macOS, dan Linux dengan custom install prompt, app shortcuts, splash screen, dan offline fallback. | Lighthouse PWA Score = 100% |
| **REQ-02** | **AI Quran Correlation Engine** | Pengguna menginput pertanyaan dalam bahasa manusia, Gemini AI dengan RAG menjawab dengan korelasi ayat & tafsir Al-Qur'an secara 100% presisi (tanpa halusinasi rujukan ayat). | Response Latency < 3.0s |
| **REQ-03** | **Interactive Quran Reader** | 114 Surah dengan teks Uthmani 30 Juz, terjemahan Bahasa Indonesia Kemenag RI, serta audio tilawah per-ayat & per-surah. | 6.236 Ayat Ter-index |
| **REQ-04** | **Hybrid Vector Search** | Pencarian semantik menggunakan database Supabase PostgreSQL (`pgvector`) + Google Gemini Embeddings (`text-embedding-004`). | Search Accuracy > 95% |
| **REQ-05** | **Responsive & Aesthetic UI** | Tampilan modern, sleek dark/light mode, glassmorphism, animasi halus, disesuaikan untuk smartphone hingga layar monitor lebar. | Mobile First Responsive |
| **REQ-06** | **Zero Infra Maintenance** | Seluruh infrastruktur berjalan di atas Vercel Serverless & Supabase Serverless Postgres. | 99.9% Uptime |

---

## 3. Detailed Feature Breakdown

### 3.1 Feature Module 1: PWA 2.0 Core Experience
- **F-1.1 Custom App Installation**: Banner dan tombol kustom untuk mengajak pengguna meng-install aplikasi ke Home Screen (Android/iOS) atau Desktop Application list.
- **F-1.2 Offline-First Quran Reader**: Caching otomatis ayat Al-Qur'an yang pernah dibuka menggunakan Service Worker (`CacheStorage` & `IndexedDB`), sehingga pembacaan Al-Qur'an tetap lancar saat tanpa koneksi internet.
- **F-1.3 Dynamic Web Manifest**: Konfigurasi `manifest.json` modern dengan `display: standalone`, color scheme adaptif, icons multi-ukuran (192x192, 512x512 maskable), dan App Shortcuts.
- **F-1.4 Push Notifications (Future Phase)**: Pengingat bacaan Al-Qur'an harian dan Ayat hari ini (*Ayah of the Day*).

### 3.2 Feature Module 2: AI Quran Assistant (Gemini + RAG)
- **F-2.1 Natural Language Input**: Input box berbasis teks & rekomendasi prompt harian (misal: "Bagaimana cara mengatasi kecemasan dalam Al-Qur'an?", "Ayat tentang kejujuran dalam berbisnis").
- **F-2.2 Semantic Vector Retrieval**: Pencarian kecocokan makna (*cosine similarity search*) terhadap database 6.236 ayat + Tafsir Kemenag RI.
- **F-2.3 AI Correlation Generation**: Pengolahan jawaban oleh Google Gemini 1.5 Flash/Pro dengan pembatasan konteks ketat (*system prompt strictness*) agar rujukan ayat 100% valid dan relevan.
- **F-2.4 Interactive Verse Cards**: Hasil jawaban AI dilengkapi kartu ayat interaktif yang dapat diklik untuk mendengarkan audio tilawah, membaca tafsir lengkap, atau menyalin ayat.

### 3.3 Feature Module 3: Al-Qur'an Reader & Explorer
- **F-3.1 Surah & Juz Index**: Daftar 114 Surah & 30 Juz dengan statistik (Jumlah ayat, tempat turun Makkiyah/Madaniyah, arti nama surah).
- **F-3.2 Reading Modes**: Mode Baca Per-Ayat dan Mode Baca Per-Halaman/Juz.
- **F-3.3 Audio Player**: Streaming audio tilawah berkualitas tinggi dari Qari ternama (Mishary Rashid Alafasy, Sheikh Abdul Rahman Al-Sudais, dll.) dengan kontrol playlist audio per-surah atau per-ayat.
- **F-3.4 Tafsir Viewer**: Modal/Drawer untuk membaca Tafsir Kemenag RI (ringkas & lengkap) per ayat.

### 3.4 Feature Module 4: Personalization & History
- **F-4.1 Bookmark & Favorites**: Menyimpan ayat-ayat pilihan pengguna ke dalam daftar bookmark lokal atau terhubung ke akun Supabase.
- **F-4.2 Query History**: Menyimpan riwayat pertanyaan AI pengguna untuk diakses kembali secara instan.
- **F-4.3 Last Read Sync**: Fitur mengingat penanda bacaan terakhir (*Tanda Baca*).

---

## 4. Non-Functional Requirements (NFR)

1. **Performance**:
   - First Contentful Paint (FCP) < 1.2 detik
   - Time to Interactive (TTI) < 2.5 detik
   - Cumulative Layout Shift (CLS) = 0
2. **Security & Privacy**:
   - Skema Supabase Row Level Security (RLS) diaktifkan untuk melindungi data pengguna.
   - API Key Gemini disimpan dengan aman di Vercel Environment Variables (`GEMINI_API_KEY`) dan hanya dipanggil melalui backend API route (`/api/ai/ask`).
3. **Usability & Accessibility (a11y)**:
   - Kontras warna memenuhi standar WCAG 2.1 AA.
   - Font Arab Uthmani yang jelas (Scheherazade New / Amiri / Lateef) dengan pengaturan ukuran font dinamis.
   - Dukungan penuh Screen Reader dan Keyboard Navigation.

---

## 5. Domain & Deployment Strategy

- **Production Domain:** `iqro.artbycode.id`
- **DNS Setup:** CNAME record ke `cname.vercel-dns.com` di DNS Provider `artbycode.id`.
- **SSL Certificate:** Auto-provisioned oleh Vercel via Let's Encrypt (TLS 1.3).
- **CI/CD Pipeline:** Automatic deployment via GitHub Integration to Vercel Production Branch.
