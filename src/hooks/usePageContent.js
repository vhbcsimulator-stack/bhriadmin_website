import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchAllPageContent, persistPageContent } from '../data/contentStore';

const siteContentQuery = {
  queryKey: queryKeys.siteContent,
  queryFn: fetchAllPageContent,
};

// Content for a single page editor. Every page shares the same query key, so
// the table is fetched once and later editors read straight from the cache.
// What Supabase stores is what the editor shows — no code defaults are merged
// in, so a page with no row yet resolves to null.
export function usePageContent(pageId) {
  const select = useCallback((all) => all[pageId] ?? null, [pageId]);

  return useQuery({ ...siteContentQuery, select });
}

export function useSavePageContent(pageId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => persistPageContent(pageId, content),
    // The saved content is authoritative, so write it into the cache directly
    // instead of spending another request re-reading what we just sent.
    onSuccess: (_data, content) => {
      queryClient.setQueryData(queryKeys.siteContent, (all) => ({ ...(all || {}), [pageId]: content }));
    },
  });
}
