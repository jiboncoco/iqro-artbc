# 📡 API Schema & Database Specification - IQRO

**Project Name:** IQRO  
**Domain:** `iqro.artbycode.id`  
**Database System:** Supabase PostgreSQL Serverless (`pgvector` enabled)  
**API Engine:** Next.js Route Handlers (REST & SSE Streaming)  

---

## 1. Database Schema Definitions (Supabase PostgreSQL)

### 1.1 Table: `surahs` (Metadata Surah)

```sql
CREATE TABLE public.surahs (
  id INT PRIMARY KEY,                       -- Nomor Surah (1 - 114)
  name_arabic VARCHAR(100) NOT NULL,        -- Contoh: "الفاتحة"
  name_latin VARCHAR(100) NOT NULL,         -- Contoh: "Al-Fatihah"
  translation_id VARCHAR(255) NOT NULL,     -- Contoh: "Pembukaan"
  total_verses INT NOT NULL,                -- Jumlah Ayat
  revelation_type VARCHAR(20) NOT NULL,     -- "meccan" atau "medinan"
  audio_url TEXT                            -- Default full audio surah URL
);
```

### 1.2 Table: `verses` (Ayat, Terjemahan, Tafsir & Vector Embedding)

```sql
-- Mengaktifkan ekstensi vector search
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.verses (
  id BIGSERIAL PRIMARY KEY,
  surah_id INT NOT NULL REFERENCES public.surahs(id) ON DELETE CASCADE,
  verse_number INT NOT NULL,                -- Nomor Ayat dalam Surah (misal: 1)
  text_uthmani TEXT NOT NULL,               -- Teks Arab Uthmani
  text_latin TEXT,                          -- Transliterasi Latin
  translation_id TEXT NOT NULL,             -- Terjemahan Bahasa Indonesia (Kemenag RI)
  tafsir_kemenag TEXT,                      -- Tafsir Ringkas/Lengkap Kemenag RI
  audio_url TEXT,                           -- URL Audio Tilawah Per-Ayat
  embedding vector(768),                    -- Embedding Vector dari Gemini text-embedding-004
  CONSTRAINT unique_surah_verse UNIQUE(surah_id, verse_number)
);

-- Indexing Vector untuk Performa Pencarian Semantik Cepat (Cosine Distance)
CREATE INDEX ON public.verses USING hnsw (embedding vector_cosine_ops);
```

### 1.3 Table: `user_history` (Riwayat Pertanyaan AI)

```sql
CREATE TABLE public.user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable jika Guest/Anonymous
  prompt TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  referenced_verses JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {surah_id, verse_number}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.4 Table: `user_bookmarks` (Ayat Favorit & Penanda Baca)

```sql
CREATE TABLE public.user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_id INT NOT NULL REFERENCES public.surahs(id),
  verse_number INT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_bookmark UNIQUE(user_id, surah_id, verse_number)
);
```

---

## 2. Supabase RPC Function for Vector Matching

```sql
CREATE OR REPLACE FUNCTION match_verses (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id bigint,
  surah_id int,
  verse_number int,
  text_uthmani text,
  translation_id text,
  tafsir_kemenag text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.surah_id,
    v.verse_number,
    v.text_uthmani,
    v.translation_id,
    v.tafsir_kemenag,
    1 - (v.embedding <=> query_embedding) AS similarity
  FROM public.verses v
  WHERE 1 - (v.embedding <=> query_embedding) > match_threshold
  ORDER BY v.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

---

## 3. Serverless API Endpoint Specifications

### 3.1 `POST /api/ai/ask`
Menjawab pertanyaan pengguna dengan memproses RAG Vector Search & Gemini AI.

#### Request Body:
```json
{
  "prompt": "Bagaimana Al-Qur'an mengajarkan cara bersikap ketika menghadapi musibah?",
  "match_count": 5
}
```

#### Response Body (200 OK):
```json
{
  "success": true,
  "query": "Bagaimana Al-Qur'an mengajarkan cara bersikap ketika menghadapi musibah?",
  "answer": "Al-Qur'an mengajarkan bahwa musibah adalah ujian kehidupan dan seorang muslim dianjurkan untuk bersabar...",
  "referenced_verses": [
    {
      "surah_id": 2,
      "surah_name_latin": "Al-Baqarah",
      "verse_number": 155,
      "text_uthmani": "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ...",
      "translation_id": "Dan Kami pasti akan menguji kamu dengan sedikit ketakutan, kelaparan...",
      "similarity_score": 0.892
    }
  ],
  "execution_time_ms": 845
}
```
