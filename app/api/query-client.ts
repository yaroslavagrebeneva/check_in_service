import { useMutation } from '@tanstack/react-query';
import { apiLogout } from './http/api';

export function useApiLogout() {
  return useMutation({
    mutationKey: ['apiLogout'],
    mutationFn: apiLogout,
  });
}
