import { QueryClient } from '@tanstack/react-query';

// Single shared client for the whole admin app. The defaults are tuned for a
// low-traffic CMS: content changes only when an admin saves it, so cached data
// stays fresh for a while and background refetches are kept to a minimum.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min before a refetch is even considered
      gcTime: 30 * 60 * 1000,     // keep cached pages around while navigating
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Remounting a route within staleTime reuses the cache with no request;
      // after that it refetches in the background while showing cached data.
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
