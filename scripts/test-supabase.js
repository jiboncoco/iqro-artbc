const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zeibcgbokjmikxqovge.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplaWJjYmdib2tqbWlreHFvdmdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTE0MjUsImV4cCI6MjEwMTA4NzQyNX0.3XVLHeLX-yg7uOruQbjYWI89XxA2SePgbPTabb-RWwQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Testing Supabase connection...');
  const { data: surahs, error: surahError } = await supabase.from('surahs').select('*').limit(5);
  console.log('Surahs Query Result:', { data: surahs, error: surahError });

  const { data: verses, error: verseError } = await supabase.from('verses').select('*').limit(5);
  console.log('Verses Query Result:', { data: verses, error: verseError });
}

checkTables();
