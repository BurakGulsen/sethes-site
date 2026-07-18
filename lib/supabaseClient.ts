import { createClient } from '@supabase/supabase-js';

// Not: import.meta.env.X şeklinde statik erişim şart — dinamik (bracket/değişken)
// erişim Vite'ın tüm VITE_ önekli değişkenleri (Gemini key dahil) bundle'a
// gömmesine neden olur.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debugging for Netlify Deployment
console.log('--- Supabase Configuration Check ---');
console.log('Site URL (VITE_SUPABASE_URL):', SUPABASE_URL ? 'Defined (OK)' : 'Undefined (MISSING)');
console.log('Anon Key (VITE_SUPABASE_ANON_KEY):', SUPABASE_ANON_KEY ? 'Defined (OK)' : 'Undefined (MISSING)');
console.log('------------------------------------');

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Fallback values to prevent crash on import if variables are missing
const url = SUPABASE_URL || 'https://placeholder.supabase.co';
const key = SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(url, key);