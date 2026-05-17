import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useApi(url, options = {}) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [url, options],
    queryFn: async () => {
      const res = await api.get(url, options);
      return res.data.data;
    },
    enabled: !!url,
  });

  return {
    data,
    loading: isLoading,
    error: error?.response?.data?.error || error?.message || null,
    refetch,
  };
}
