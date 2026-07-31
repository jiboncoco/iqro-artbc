# 🏗️ System Design Document - IQRO

**Project Name:** IQRO  
**Domain:** `iqro.artbycode.id`  
**Deployment Infrastructure:** Vercel Global Edge Network + Supabase PostgreSQL  

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph Client Layer [PWA 2.0 Client - Browser / Mobile / Desktop]
        AppUI["Next.js React UI Layer"]
        ServiceWorker["Workbox Service Worker"]
        LocalCache["CacheStorage & IndexedDB"]
        ZustandStore["State Manager (Audio/Reader)"]
    end

    subgraph Edge Layer [Vercel Global Network]
        VercelCDN["Vercel Edge Network / CDN"]
        NextServerless["Serverless API Routes (/api/*)"]
    end

    subgraph Database Layer [Supabase Cloud]
        SupabaseDB[("PostgreSQL Serverless")]
        PgVector["pgvector HNSW Index"]
        SupabaseAuth["Supabase Auth Engine"]
      end

    subgraph External Services [AI & Media Providers]
        GeminiAPI["Google Gemini 1.5 Flash API"]
        GeminiEmbed["Google Gemini Text Embedding API"]
        QuranAudioCDN["Quran Audio CDN (Islamic Network)"]
    end

    AppUI <--> ServiceWorker
    ServiceWorker <--> LocalCache
    AppUI <--> ZustandStore
    
    AppUI -- HTTPS Requests --> VercelCDN
    VercelCDN --> NextServerless
    
    NextServerless -- Vector Search RPC --> PgVector
    NextServerless -- Auth / Data Query --> SupabaseDB
    
    NextServerless -- Embed Question --> GeminiEmbed
    NextServerless -- Prompt + Context --> GeminiAPI
    
    AppUI -- Audio Stream --> QuranAudioCDN
```

---

## 2. End-to-End RAG Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna (PWA)
    participant Client as Next.js Frontend
    participant API as Serverless Route (/api/ai/ask)
    participant GeminiEmb as Gemini Embedding API
    participant DB as Supabase pgvector DB
    participant GeminiAI as Gemini 1.5 Flash API

    User->>Client: Input pertanyaan ("Bagaimana ketenangan hati diciptakan?")
    Client->>API: POST /api/ai/ask { prompt }
    API->>GeminiEmb: Request Embedding ("Bagaimana ketenangan...")
    GeminiEmb-->>API: Return Vector Float Array (768 dim)
    
    API->>DB: Call match_verses(query_embedding, 0.5, 5)
    DB-->>API: Return Top 5 Matched Verses + Tafsir
    
    API->>GeminiAI: Construct Prompt (System Instruction + Matched Verses Context)
    GeminiAI-->>API: Streamed Answer Text with Quran Citations
    
    API-->>Client: HTTP JSON Response (Answer + Referenced Verse Cards)
    Client-->>User: Display AI Answer Card & Interactive Verse Player
```

---

## 3. Database Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    SURAHS ||--|{ VERSES : "contains"
    USERS ||--o{ USER_HISTORY : "queries"
    USERS ||--o{ USER_BOOKMARKS : "saves"
    SURAHS ||--o{ USER_BOOKMARKS : "bookmarked_in"

    SURAHS {
        int id PK
        string name_arabic
        string name_latin
        string translation_id
        int total_verses
        string revelation_type
        string audio_url
    }

    VERSES {
        bigint id PK
        int surah_id FK
        int verse_number
        text text_uthmani
        text text_latin
        text translation_id
        text tafsir_kemenag
        text audio_url
        vector embedding
    }

    USERS {
        uuid id PK
        string email
        timestamp created_at
    }

    USER_HISTORY {
        uuid id PK
        uuid user_id FK
        text prompt
        text ai_response
        jsonb referenced_verses
        timestamp created_at
    }

    USER_BOOKMARKS {
        uuid id PK
        uuid user_id FK
        int surah_id FK
        int verse_number
        text notes
        timestamp created_at
    }
```
