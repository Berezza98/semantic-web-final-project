import React, { useMemo } from 'react';
import { Loader } from '../components/Loader.js';
import { getMovies } from '../api/getMovies.js';
import { Movie } from '../interfaces/Movie.js';
import SelectInput from 'ink-select-input';
import { useNavigate, useQuery } from '../hooks/index.js';
import { ROUTES } from '../consts/index.js';

export const Home = () => {

  const navigate = useNavigate();

	const moviesQuery = useQuery({
    queryFn: async () => getMovies(0),
  })

  type Item<T> = NonNullable<React.ComponentProps<typeof SelectInput>['items']>[0] & {
    value: T
  };

  const items = useMemo<Item<Movie>[]>(() => {
    if (!moviesQuery.data) return [];

    return moviesQuery.data.map((m, i) => ({
      key: m.name + i,
      label: m.name,
      value: m,
    }));
  }, [moviesQuery.data]);

  const handleSelect = (item: Item<Movie>) => {
    navigate(ROUTES.ACTORS, item.value);
	};

  if (moviesQuery.isLoading) return <Loader />;

	return (
    <SelectInput<Movie> items={items} onSelect={handleSelect} />
  );
}