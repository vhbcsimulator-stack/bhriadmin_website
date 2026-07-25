import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryKeys';
import { getAllProperties, saveProperty, deleteProperty } from '../data/propertiesManager';

export function useProperties() {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: getAllProperties,
  });
}

export function useSaveProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties }),
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties }),
  });
}
