import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { fetchAllPageContent, mergeWithDefaults, persistPageContent } from '../data/contentStore';
import { PAGE_CONTENT_DEFAULTS } from '../data/pageContentRegistry';

const siteContentQuery = {
  queryKey: queryKeys.siteContent,
  queryFn: fetchAllPageContent,
};

// Content for a single page editor. Every page shares the same query key, so
// the table is fetched once and later editors read straight from the cache.
export function usePageContent(pageId) {
  const defaults = PAGE_CONTENT_DEFAULTS[pageId];

  const select = useCallback(
    (all) => mergeWithDefaults(defaults, all[pageId]),
    [defaults, pageId]
  );

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
