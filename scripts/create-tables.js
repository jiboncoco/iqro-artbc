const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zeibcbgbokjmikxqovge.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWJjYmdib2tqbWlreHFvdmdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTUxMTQyNSwiZXhwIjoyMTAxMDg3NDI1fQ.caSB-ompoC8ssLnyTA9RBRw0WSpeTEF_-9I6DvJpUmU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTablesAndSeed() {
  console.log('Testing SQL creation via RPC or API...');

  // Try creating via RPC exec_sql or direct insert if tables exist
  const sqlStatements = `
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS public.surahs (
      id INT PRIMARY KEY,
      name_arabic VARCHAR(100) NOT NULL,
      name_latin VARCHAR(100) NOT NULL,
      translation_id VARCHAR(255) NOT NULL,
      total_verses INT NOT NULL,
      revelation_type VARCHAR(20) NOT NULL,
      audio_url TEXT
    );

    CREATE TABLE IF NOT EXISTS public.verses (
      id BIGSERIAL PRIMARY KEY,
      surah_id INT NOT NULL REFERENCES public.surahs(id) ON DELETE CASCADE,
      verse_number INT NOT NULL,
      text_uthmani TEXT NOT NULL,
      text_latin TEXT,
      translation_id TEXT NOT NULL,
      tafsir_kemenag TEXT,
      audio_url TEXT,
      embedding vector(768),
      CONSTRAINT unique_surah_verse UNIQUE(surah_id, verse_number)
    );
  `;

  // Test fetch to Supabase REST SQL endpoint
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: sqlStatements }),
    });
    console.log('RPC exec_sql response:', res.status, await res.text());
  } catch (err) {
    console.error('RPC Error:', err);
  }
}

createTablesAndSeed();
