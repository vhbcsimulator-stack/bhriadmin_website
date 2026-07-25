import { supabase } from '../supabaseClient';

const LS_KEY = 'bhri_site_content';

// Fill any fields missing from stored content with the code defaults, so pages
// keep working when new sections are added after content was saved.
const mergeWithDefaults = (defaults, stored) => {
  if (stored === undefined || stored === null) return defaults;
  if (Array.isArray(stored)) return stored;
  if (typeof stored === 'object' && defaults && typeof defaults === 'object' && !Array.isArray(defaults)) {
    const merged = { ...defaults };
    for (const key of Object.keys(stored)) {
      merged[key] = mergeWithDefaults(defaults[key], stored[key]);
    }
    return merged;
  }
  return stored;
};

const readLocal = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const writeLocal = (pageId, content) => {
  try {
    const all = readLocal();
    all[pageId] = content;
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to cache site content in localStorage:", e);
  }
};

export const fetchPageContent = async (pageId, defaults) => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', pageId)
      .maybeSingle();

    if (error) {
      console.error(`Failed to fetch site content "${pageId}" from Supabase, falling back to local data:`, error);
      const local = readLocal()[pageId];
      return local ? mergeWithDefaults(defaults, local) : defaults;
    }

    if (!data || !data.content) {
      const local = readLocal()[pageId];
      return local ? mergeWithDefaults(defaults, local) : defaults;
    }

    writeLocal(pageId, data.content);
    return mergeWithDefaults(defaults, data.content);
  } catch (e) {
    console.error(`Exception fetching site content "${pageId}":`, e);
    const local = readLocal()[pageId];
    return local ? mergeWithDefaults(defaults, local) : defaults;
  }
};

export const persistPageContent = async (pageId, content) => {
  writeLocal(pageId, content);

  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: pageId, content, updated_at: new Date().toISOString() });

    if (error) {
      console.error(`Failed to save site content "${pageId}" in Supabase:`, error);
      if (error.message && (error.message.includes('fetch') || error.message.includes('placeholder') || error.message.includes('network'))) {
        console.warn("Offline fallback saved to localStorage successfully.");
        return;
      }
      throw error;
    }
  } catch (err) {
    console.error("Supabase upsert threw exception:", err);
    if (err.message && (err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed to fetch'))) {
      console.warn("Offline fallback saved to localStorage successfully after network exception.");
      return;
    }
    throw err;
  }
};
