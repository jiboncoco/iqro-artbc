/**
 * Seed ALL 114 surahs + ~6236 verses (with real Tafsir Kemenag) into Supabase.
 *
 * - Surah list : https://equran.id/api/v2/surat
 * - Verses     : https://equran.id/api/v2/surat/{id}
 * - Tafsir     : https://equran.id/api/v2/tafsir/{id}
 *
 * Upserts are safe to re-run: existing rows get their text fields refreshed,
 * while the `embedding` column is preserved (not included in the payload).
 *
 * Usage: node --env-file=.env.local scripts/seed-full-quran.mjs
 */

import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}
const sb = createClient(URL, KEY);

const VERSE_CHUNK = 200;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`  GET ${url} attempt ${attempt} failed: ${err.message}`);
      if (attempt === 4) throw err;
      await sleep(1500 * attempt);
    }
  }
}

async function upsertRows(table, rows, conflict) {
  for (let i = 0; i < rows.length; i += VERSE_CHUNK) {
    const chunk = rows.slice(i, i + VERSE_CHUNK);
    const { error } = await sb.from(table).upsert(chunk, { onConflict: conflict });
    if (error) throw new Error(`upsert ${table}: ${error.message}`);
    await sleep(200);
  }
}

(async () => {
  // ---- 1. Surah list ---------------------------------------------------------
  console.log('Fetching surah list...');
  const listJson = await getJson('https://equran.id/api/v2/surat');
  const surahRows = listJson.data.map((s) => ({
    id: s.nomor,
    name_arabic: s.nama,
    name_latin: s.namaLatin,
    translation_id: s.arti,
    total_verses: s.jumlahAyat,
    revelation_type: /madin/i.test(s.tempatTurun || '') ? 'medinan' : 'meccan',
  }));
  console.log(`Upserting ${surahRows.length} surahs...`);
  await upsertRows('surahs', surahRows, 'id');
  console.log('Surahs seeded.');

  // ---- 2. Verses + tafsir ------------------------------------------------------
  const verseRows = [];
  for (const s of listJson.data) {
    const [detailJson, tafsirJson] = await Promise.all([
      getJson(`https://equran.id/api/v2/surat/${s.nomor}`),
      getJson(`https://equran.id/api/v2/tafsir/${s.nomor}`).catch(() => null),
    ]);

    const tafsirMap = new Map();
    if (tafsirJson?.data?.tafsir) {
      for (const t of tafsirJson.data.tafsir) {
        if (t?.ayat != null && t?.teks) tafsirMap.set(t.ayat, String(t.teks).slice(0, 4000));
      }
    }

    for (const a of detailJson.data.ayat) {
      const audioValues = a.audio ? Object.values(a.audio) : [];
      verseRows.push({
        surah_id: s.nomor,
        verse_number: a.nomorAyat,
        text_uthmani: a.teksArab,
        text_latin: a.teksLatin || null,
        translation_id: a.teksIndonesia,
        tafsir_kemenag: tafsirMap.get(a.nomorAyat) || null,
        audio_url: a.audio?.['05'] || audioValues[0] || null,
      });
    }

    process.stdout.write(`\rFetched surah ${s.nomor}/114 (${verseRows.length} verses)`);
    await sleep(250);
  }
  console.log('');

  console.log(`Upserting ${verseRows.length} verses (embedding column preserved)...`);
  await upsertRows('verses', verseRows, 'surah_id,verse_number');

  // ---- 3. Verify ---------------------------------------------------------------
  const { count: cS } = await sb.from('surahs').select('*', { count: 'exact', head: true });
  const { count: cV } = await sb.from('verses').select('*', { count: 'exact', head: true });
  const { count: cT } = await sb
    .from('verses')
    .select('*', { count: 'exact', head: true })
    .not('tafsir_kemenag', 'is', null);
  console.log(`DONE. surahs=${cS}, verses=${cV}, verses_with_tafsir=${cT}`);
})();
