import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getMovies } from '../api/getMovies.js';
import { Movie } from '../interfaces/Movie.js';
import SelectInput from 'ink-select-input';
import { useGetCurrentRouteData, useNavigate, useQuery } from '../hooks/index.js';
import { ROUTES } from '../consts/index.js';
import { Page } from '../components/Page.js';

export const MoviesListPage = () => {
  const { navigate, changeCurrentRouteData } = useNavigate();
  const routerData = useGetCurrentRouteData<{ page?: number, initialIndex?: number }>();

  const [page, setPage] = useState<number>(routerData?.page ?? 0);

  const queryFn = useCallback(async () => getMovies(page), [page]);

	const moviesQuery = useQuery({
    queryFn,
    cacheKey: `movies_${page}`,
  });

  useEffect(() => {
    changeCurrentRouteData((currentRouteData) => ({
      ...currentRouteData,
      page,
    }));
  }, [changeCurrentRouteData, page]);

  useInput((input, key) => {
    if (key.rightArrow) {
      setPage(currentPage => currentPage + 1);
      return;
    }

    if (key.leftArrow && page >= 1) {
      setPage(currentPage => currentPage - 1);
      return;
    }
	});

  type Item<T> = NonNullable<React.ComponentProps<typeof SelectInput>['items']>[0] & {
    value: T
  };

  const movies = useMemo<Item<Movie>[]>(() => {
    if (!moviesQuery.data) return [];

    return moviesQuery.data.map((movie, i) => ({
      key: movie.name + i,
      label: movie.name,
      value: movie,
    }));
  }, [moviesQuery.data]);

  const handleSelect = useCallback((item: Item<Movie>) => {
    navigate(ROUTES.MOVIE, item.value);
	}, [navigate]);

  const handleHighlight = useCallback((item: Item<Movie>) => {
    const index = movies.indexOf(item);

    changeCurrentRouteData((currentRouteData) => ({
      ...currentRouteData,
      initialIndex: index,
    }));
  }, [changeCurrentRouteData, movies]);

	return (
    <Page title="Movies" isLoading={moviesQuery.isLoading}>
      <SelectInput<Movie>
        items={movies}
        onHighlight={handleHighlight}
        initialIndex={routerData?.initialIndex}
        onSelect={handleSelect}
      />
      <Box borderStyle="classic" borderColor="blue" justifyContent="center">
        <Text>Page {page + 1}</Text>
      </Box>
      <Box borderStyle="classic" borderColor="yellow" alignItems="center" flexDirection="column">
        <Text>Press Arrow Left - Previous Page</Text>
        <Text>Press Arrow Right - Next Page</Text>
      </Box>
    </Page>
  );
}