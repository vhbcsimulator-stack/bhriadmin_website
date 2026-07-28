import { supabase } from '../supabaseClient';

// Fetches every page's content in one request. The site_content table holds a
// handful of JSON rows, so pulling it whole is cheaper than one request per
// page editor and lets all of them share a single cache entry.
//
// Supabase is the only source of truth: there is no local cache or bundled
// default, so a failed request rejects and the editor stays in its error state
// rather than presenting stale content as if it were saved.
export const fetchAllPageContent = async () => {
  const { data, error } = await supabase
    .from('site_content')
    .select('id, content');

  if (error) throw error;

  const all = {};
  for (const row of data || []) {
    if (row && row.content) all[row.id] = row.content;
  }
  return all;
};

export const persistPageContent = async (pageId, content) => {
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: pageId, content, updated_at: new Date().toISOString() });

  if (error) throw error;
};
