/**
 * Backfill `verses.embedding` (vector 768-dim) in Supabase using
 * Gemini gemini-embedding-001 (RETRIEVAL_DOCUMENT).
 *
 * Resumable by design: the database itself is the checkpoint — the script
 * keeps selecting rows WHERE embedding IS NULL until none are left.
 * Safe to stop/restart at any time.
 *
 * Usage: node --env-file=.env.local scripts/backfill-verses-embeddings.mjs
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const API_KEY = process.env.GEMINI_API_KEY;
if (!URL || !KEY || !API_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and GEMINI_API_KEY are required.');
  process.exit(1);
}
const sb = createClient(URL, KEY);

const EMBED_MODEL = 'models/gemini-embedding-001';
const DIM = 768;
const BATCH = 15;          // small: free-tier embedding quotas are tight
const PAUSE_MS = 3000;     // gentle pacing between batches
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchBatch() {
  const { data, error } = await sb
    .from('verses')
    .select('id, surah_id, verse_number, translation_id, surahs(name_latin)')
    .filter('embedding', 'is', null)
    .order('surah_id')
    .order('verse_number')
    .limit(BATCH);
  if (error) throw new Error(`fetch batch: ${error.message}`);
  return data || [];
}

async function countRemaining() {
  const { count } = await sb
    .from('verses')
    .select('*', { count: 'exact', head: true })
    .filter('embedding', 'is', null);
  return count ?? 0;
}

// Patient embed with quota-aware retries (honours RetryInfo when present).
async function embedBatch(texts) {
  const body = {
    requests: texts.map((text) => ({
      model: EMBED_MODEL,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_DOCUMENT',
      outputDimensionality: DIM,
    })),
  };

  let waitMs = 20000;
  for (let attempt = 1; attempt <= 15; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${EMBED_MODEL}:batchEmbedContents?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(90000),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.embeddings) {
        if (res.status !== 429 && res.status !== 503) {
          throw new Error(`HTTP ${res.status} ${(json.error?.message || '').slice(0, 160)}`);
        }
        const retryDelaySec = json.error?.details?.find((d) =>
          d['@type']?.includes('RetryInfo')
        )?.retryDelay;
        const suggested = retryDelaySec ? parseFloat(retryDelaySec) * 1000 + 2000 : waitMs;
        console.log(`  [${new Date().toLocaleTimeString()}] quota limited, waiting ${Math.round(suggested / 1000)}s...`);
        await sleep(suggested);
        waitMs = Math.min(waitMs * 1.5, 180000);
        continue;
      }
      return json.embeddings.map((e) => e.values);
    } catch (err) {
      if (/quota|ECONNRESET|timeout|abort|fetch failed/i.test(err.message)) {
        console.log(`  transient error (${err.message.slice(0, 80)}), waiting ${Math.round(waitMs / 1000)}s...`);
        await sleep(waitMs);
        waitMs = Math.min(waitMs * 1.5, 180000);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Embedding batch failed after all retries.');
}

(async () => {
  let done = 0;
  let remaining = await countRemaining();
  console.log(`Starting embedding backfill. Remaining rows without embedding: ${remaining}`);

  while (true) {
    const rows = await fetchBatch();
    if (rows.length === 0) break;

    const texts = rows.map((r) => {
      const name = Array.isArray(r.surahs) ? r.surahs[0]?.name_latin : r.surahs?.name_latin;
      return `${name || 'Surah ' + r.surah_id}. ${r.translation_id}`;
    });
    const vectors = await embedBatch(texts);

    for (let i = 0; i < rows.length; i++) {
      const vec = vectors[i];
      if (!vec || vec.length !== DIM) throw new Error(`dim mismatch on id=${rows[i].id}`);
      const { error } = await sb
        .from('verses')
        .update({ embedding: vec })
        .eq('id', rows[i].id);
      if (error) throw new Error(`update id=${rows[i].id}: ${error.message}`);
    }

    done += rows.length;
    remaining = await countRemaining();
    console.log(
      `[${new Date().toLocaleTimeString()}] +${rows.length} embedded (total ${done}, remaining ${remaining})`
    );
    await sleep(PAUSE_MS);
  }

  console.log(`DONE. All verses have embeddings. Total updated this run: ${done}`);
})();
