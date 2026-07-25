import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getAllApplicants, updateApplicantStatus, deleteApplicant } from '../data/applicantsManager';

export function useApplicants() {
  return useQuery({
    queryKey: queryKeys.applicants,
    queryFn: getAllApplicants,
    // Failures here are permission/config problems rather than network blips,
    // and the page offers an explicit Retry button.
    retry: false,
  });
}

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateApplicantStatus(id, status),
    // Only one field changed, so patch the cached list rather than refetching it.
    onSuccess: (_data, { id, status }) => {
      queryClient.setQueryData(queryKeys.applicants, (list) =>
        (list || []).map((a) => (a.id === id ? { ...a, status } : a))
      );
    },
  });
}

export function useDeleteApplicant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplicant,
    onSuccess: (_data, applicant) => {
      queryClient.setQueryData(queryKeys.applicants, (list) =>
        (list || []).filter((a) => a.id !== applicant.id)
      );
    },
  });
}
