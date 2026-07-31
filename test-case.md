# 🧪 QA Test Cases Document - IQRO

**Project Name:** IQRO  
**Domain:** `iqro.artbycode.id`  
**Test Coverage:** Functional, AI RAG Accuracy, PWA 2.0, Offline Mode, Responsiveness & Performance  

---

## 1. Functional Test Cases

| Test Case ID | Feature Area | Description / Scenario | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **TC-FUNC-01** | AI Assistant | Pengguna menginput pertanyaan dalam bahasa manusia. | AI memberikan jawaban bahasa Indonesia yang santun disertai rujukan ayat Al-Qur'an. | High |
| **TC-FUNC-02** | AI Verse Cards | Klik kartu rujukan ayat pada hasil jawaban AI. | Muncul modal detail ayat (Teks Arab, Terjemahan, Tafsir, & Tombol Play Audio). | High |
| **TC-FUNC-03** | Quran Index | Membuka halaman `/quran` dan mengetik "Al-Baqarah" pada kolom pencarian. | Daftar surah secara instan terfilter menampilkan Surah Al-Baqarah. | High |
| **TC-FUNC-04** | Quran Reader | Membuka detail Surah Al-Fatihah (Surah 1). | Teks Uthmani 7 ayat tampil dengan rapi beserta terjemahan Kemenag RI. | High |
| **TC-FUNC-05** | Audio Player | Klik tombol Play pada ayat 1 Surah Al-Fatihah. | Audio tilawah berputar dengan jernih dan bar player global muncul di bawah layar. | High |
| **TC-FUNC-06** | Bookmark | Klik tombol icon Bookmark pada ayat tertentu. | Ayat berhasil tersimpan di daftar bookmark lokal / akun pengguna. | Medium |

---

## 2. AI RAG Accuracy & Grounding Test Cases

| Test Case ID | Test Category | Input Prompt / Condition | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **TC-RAG-01** | Vector Match | Prompt: *"Bagaimana Al-Qur'an memandang sabar saat ujian?"* | Supabase `match_verses` mengembalikan QS. Al-Baqarah: 155-156 dan QS. Az-Zumar: 10. | High |
| **TC-RAG-02** | Citation Accuracy | Verifikasi nomor Surah & Ayat pada jawaban Gemini. | Semua nomor Surah & Ayat 100% cocok dengan teks ayat asli di database (0% halusinasi). | Critical |
| **TC-RAG-03** | Out of Scope | Prompt: *"Bagaimana cara membuat resep kue martabak manis?"* | AI menolak secara santun dan mengarahkan pengguna untuk menanyakan topik Al-Qur'an/kehidupan. | Medium |

---

## 3. PWA 2.0 & Offline Test Cases

| Test Case ID | Platform | Test Scenario | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **TC-PWA-01** | Android Chrome | Buka `iqro.artbycode.id` di Chrome Android. | Tampil kustom banner "Install IQRO App" dan aplikasi dapat diinstall ke Home Screen. | High |
| **TC-PWA-02** | iOS Safari | Buka `iqro.artbycode.id` di Safari iPhone/iPad. | Tampil panduan instalasi iOS ("Add to Home Screen"). | High |
| **TC-PWA-03** | Offline Reader | Matikan koneksi internet (Airplane Mode), lalu buka Surah yang pernah dibaca. | Teks Surah tetap dapat dibaca 100% tanpa error jaringan (*Served from CacheStorage*). | High |
| **TC-PWA-04** | Offline AI Guard | Matikan internet, lalu coba kirim pertanyaan ke AI Assistant. | Tampil ucapan *Offline Banner*: "Fitur AI membutuhkan koneksi internet, Anda tetap dapat membaca Al-Qur'an luring". | Medium |

---

## 4. Responsive UI & Layout Test Cases

| Test Case ID | Viewport / Device | Test Scenario | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **TC-RESP-01** | Mobile (375px - iPhone 14) | Buka Homepage & Quran Reader. | Layout 1 kolom, font Arab proporsional, navbar bawah (*bottom navigation*) mudah dijangkau jempol. | High |
| **TC-RESP-02** | Tablet (768px - iPad) | Buka Homepage & AI Chat. | Grid 2 kolom adaptif, modal tafsir tampil dalam ukuran medium centering. | High |
| **TC-RESP-03** | Desktop (1440px - Mac/PC) | Buka IQRO di browser monitor lebar. | Sidebar navigasi tampil penuh, konten AI & Reader terpusat (*max-width container*). | High |
