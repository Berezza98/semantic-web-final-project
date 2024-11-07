import { useInput, Text } from "ink";
import { useNavigate } from "../hooks/useNavigate.js";
import { ROUTES } from "../consts/routes.js";
import { useGetCurrentRouteData } from "../hooks/useGetCurrentRouteData.js";
import { Movie } from "../interfaces/Movie.js";
import { useQuery } from "../hooks/useQuery.js";
import { Loader } from "../components/Loader.js";
import { getActors } from "../api/getActors.js";
import SelectInput from "ink-select-input";
import { useMemo } from "react";
import { Actor } from "../interfaces/Actor.js";

type Item<T> = NonNullable<React.ComponentProps<typeof SelectInput>['items']>[0] & {
  value: T
};

export const ActorsPage = () => {
  const navigate = useNavigate();
  const routerData = useGetCurrentRouteData<Movie>();

  const actorsQuery = useQuery<Actor[]>({
    queryFn: async () => {
      return getActors(routerData.urlName);
    },
    cacheKey: `actors_${routerData.urlName}`,
  })

  useInput((input, key) => {
		if (key.delete) {
      navigate(ROUTES.MOVIE_LIST);
    }
	});

  const items = useMemo<Item<Actor>[]>(() => {
    if (!actorsQuery.data) return [];

    return actorsQuery.data.map((actor, index) => ({
      label: actor.name,
      value: actor,
      key: actor.name + index,
    }));
  }, [actorsQuery.data]);

  if (actorsQuery.isLoading) return <Loader />;
  if (actorsQuery.error) return <Text color="red">Loading error</Text>

  return (
    <SelectInput<Actor> items={items} />
  );
}