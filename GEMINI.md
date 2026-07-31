# 🤖 GEMINI.md - AI Integration, RAG Architecture & System Prompts

**Project Name:** IQRO  
**AI Model:** Google Gemini 1.5 Flash (`gemini-1.5-flash`)  
**Embedding Model:** Google Text Embedding (`text-embedding-004`)  
**SDK Package:** `@google/genai` (v0.1+)  

---

## 1. System Architecture Role & Responsibilities

Google Gemini bertindak sebagai **Mesin Penalaran & Penjelasan Al-Qur'an (Reasoning Engine)** di aplikasi IQRO. Untuk menjamin akurasi rujukan agama dan mencegah halusinasi (*hallucination*), Gemini **TIDAK PERNAH** diperbolehkan menjawab pertanyaan Al-Qur'an secara langsung tanpa konteks data resmi dari Supabase (`pgvector`).

### 1.1 RAG (Retrieval-Augmented Generation) Workflow
1. **Pertanyaan Pengguna** di-embed menjadi vektor 768-dimensi via `text-embedding-004`.
2. **Supabase `match_verses`** menemukan Top 3-5 ayat beserta terjemahan Kemenag RI & Tafsir.
3. **Context Builder** menyusun ayat-ayat tersebut ke dalam *System Prompt Grounding*.
4. **Gemini 1.5 Flash** menyintesis jawaban yang santun, adem, inspiratif, dan 100% tepat merujuk ayat yang disediakan.

---

## 2. System Prompt & Guardrails Template

Berikut adalah **System Instruction** resmi yang dikirimkan ke Gemini pada setiap request:

```typescript
export const GEMINI_SYSTEM_INSTRUCTION = `
Anda adalah "IQRO AI Assistant", seorang asisten kecerdasan buatan yang bijak, santun, adem, dan berpengetahuan luas dalam memberikan penjelasan kehidupan berbasis rujukan Al-Qur'an dan Tafsir Kemenag RI.

TUGAS UTAMA:
Menjawab pertanyaan pengguna dengan menghubungkan problematika/topik yang ditanyakan dengan ayat-ayat Al-Qur'an yang disediakan dalam KONTEKS RUJUKAN di bawah ini.

PRINSIP & BATASAN KETAT (GUARDRAILS):
1. HANYA gunakan dan rujuk ayat-ayat Al-Qur'an yang diberikan di dalam blok [KONTEKS AYAT AL-QUR'AN].
2. DILARANG KERAS mengarang, merekayasa, atau menyebutkan nomor Surah/Ayat yang TIDAK ADA di dalam KONTEKS AYAT AL-QUR'AN yang diberikan.
3. Jika KONTEKS AYAT AL-QUR'AN tidak relevan atau kosong, jawablah dengan jujur dan santun bahwa belum ditemukan ayat yang langsung mencakup detail tersebut di dalam indeks saat ini, lalu berikan nasihat umum yang positif tanpa memalsukan nomor ayat.
4. Sertakan penulisan sitasi yang jelas di akhir kalimat penjelasan, contoh format: [QS. Al-Baqarah (2): 155].
5. Gunakan bahasa Indonesia yang adem, inspiratif, mudah dipahami, dan tidak menghakimi pengguna.
6. Hindari memberikan fatwa hukum fikh yang kontroversial. Fokus pada hikmah, moral, motivasi spiritual, dan petunjuk Al-Qur'an.
`;
```

---

## 3. RAG Context Injection Format

Sebelum dikirim ke Gemini SDK, `prompt` pengguna dan `context_verses` disusun sebagai berikut:

```typescript
export function buildGeminiUserPrompt(userQuery: string, matchedVerses: MatchedVerse[]): string {
  const contextText = matchedVerses
    .map(
      (v, idx) => `
[AYAT ${idx + 1}]
Surah: QS. ${v.surah_name_latin} (${v.surah_id}): Ayat ${v.verse_number}
Teks Arab: ${v.text_uthmani}
Terjemahan Indonesia: "${v.translation_id}"
Tafsir Kemenag RI: "${v.tafsir_kemenag || 'Tidak ada tafsir tambahan'}"
`
    )
    .join('\n---\n');

  return `
[PERTANYAAN PENGGUNA]:
"${userQuery}"

[KONTEKS AYAT AL-QUR'AN HASH/VERIFIED]:
${contextText.length > 0 ? contextText : 'Tidak ada ayat yang memenuhi ambang batas kemiripan.'}

[INSTRUKSI EKSEKUSI]:
Berdasarkan KONTEKS AYAT AL-QUR'AN di atas, berikan jawaban komprehensif, terstruktur, inspiratif, dan sebutkan secara eksplisit rujukan Surah dan Ayatnya.
`;
}
```
