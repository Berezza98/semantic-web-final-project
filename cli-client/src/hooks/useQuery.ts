import { useEffect, useMemo, useState } from "react";

interface UseQueryArgs<T> {
  queryFn: () => T | Promise<T>;
}

interface UseQueryResult<T> {
  isLoading: boolean;
  data?: T;
}

export const useQuery = <T>(args: UseQueryArgs<T>): UseQueryResult<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function run() {
      setIsLoading(true);
      const response = await args.queryFn();
      setData(response);
      setIsLoading(false);
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useMemo(() => {
    return {
      data,
      isLoading,
    };
  }, [data, isLoading]);

  return result;
};
