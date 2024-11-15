import { useEffect, useMemo, useState } from 'react';

interface UseQueryArgs<T> {
  queryFn: () => T | Promise<T>;
  cacheKey?: string;
}

interface UseQueryResult<T> {
  isLoading: boolean;
  error?: Error;
  data?: T;
}

const cache: Record<string, unknown> = {};

export const useQuery = <T>({
  queryFn,
  cacheKey,
}: UseQueryArgs<T>): UseQueryResult<T> => {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    async function run() {
      try {
        if (cacheKey && cache[cacheKey]) {
          setData(cache[cacheKey] as T);
          return;
        }

        setIsLoading(true);
        const response = await queryFn();
        setData(response);

        if (cacheKey) cache[cacheKey] = response;
      } catch (e) {
        if (e instanceof Error) setError(e);
      } finally {
        setIsLoading(false);
      }
    }
    run();
  }, [cacheKey, queryFn]);

  const result = useMemo(() => {
    return {
      data,
      isLoading,
      error,
    };
  }, [data, isLoading, error]);

  return result;
};
