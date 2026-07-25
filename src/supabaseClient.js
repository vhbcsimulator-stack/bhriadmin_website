import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project-id.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// These are baked in at build time, so a deployment whose host is missing them
// silently points every request at a domain that does not exist — which looks
// like "Supabase is slow" rather than a configuration error.
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

if (!isSupabaseConfigured) {
  console.error("Supabase URL or Anon Key is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in admin/.env locally, and in the environment variables of your deployment (they must be set at build time).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
