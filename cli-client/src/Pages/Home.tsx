import React, { useState, useEffect, useMemo } from 'react';
import { Loader } from '../components/Loader.js';
import { getMovies } from '../api/getMovies.js';
import { Movie } from '../interfaces/Movie.js';
import SelectInput from 'ink-select-input';

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

	useEffect(() => {
		async function loadingMovies() {
      setLoading(true);
      const m = await getMovies(0);

      setMovies(m);
      setLoading(false);
    }

    loadingMovies();
	}, []);

  type Item<T> = NonNullable<React.ComponentProps<typeof SelectInput>['items']>[0] & {
    value: T
  };

  const items = useMemo<Item<Movie>[]>(() => {
    return movies.map((m, i) => ({
      key: m.name + i,
      label: m.name,
      value: m,
    }));
  }, [movies]);

  const handleSelect = (item: Item<Movie>) => {
		console.log(item);
	};

  if (loading) return <Loader />;

	return (
    <SelectInput<Movie> items={items} onSelect={handleSelect} />
  );
}