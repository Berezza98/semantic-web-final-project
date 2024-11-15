import { useInput, Text, Newline } from "ink";
import { useNavigate } from "../hooks/useNavigate.js";
import { ROUTES } from "../consts/routes.js";
import { useGetCurrentRouteData } from "../hooks/useGetCurrentRouteData.js";
import { Movie } from "../interfaces/Movie.js";
import { useQuery } from "../hooks/useQuery.js";
import { getActors } from "../api/getActors.js";
import SelectInput from "ink-select-input";
import { useCallback, useMemo } from "react";
import { Actor } from "../interfaces/Actor.js";
import { Page } from "../components/Page.js";

type Item<T> = NonNullable<React.ComponentProps<typeof SelectInput>['items']>[0] & {
  value: T
};

export const ActorListPage = () => {
  const { back, navigate, changeCurrentRouteData } = useNavigate();
  const routerData = useGetCurrentRouteData<Movie & { initialIndex?: number }>();

  const actorsQuery = useQuery<Actor[]>({
    queryFn: async () => {
      return getActors(routerData.urlName);
    },
    cacheKey: `actors_${routerData.urlName}`,
  })

  useInput((input, key) => {
		if (key.delete) {
      back();
    }
	});

  const selectActor = useCallback((item: Item<Actor>) => {
    navigate(ROUTES.ACTOR, item.value);
  }, [navigate]);

  const items = useMemo<Item<Actor>[]>(() => {
    if (!actorsQuery.data) return [];

    return actorsQuery.data.map((actor, index) => ({
      label: actor.name,
      value: actor,
      key: actor.name + index,
    }));
  }, [actorsQuery.data]);

  const handleHighlight = useCallback((item: Item<Movie>) => {
    const index = items.indexOf(item);

    changeCurrentRouteData((currentRouteData) => ({
      ...currentRouteData,
      initialIndex: index,
    }));
  }, [changeCurrentRouteData, items]);

  return (
    <Page title="Actors" isLoading={actorsQuery.isLoading}>
        <Text>Актори фільму: {routerData.name}</Text>
        <Newline />
        {
          actorsQuery.error
            ? <Text color="red">Loading error</Text>
            : <SelectInput<Actor>
                items={items}
                initialIndex={routerData?.initialIndex}
                onHighlight={handleHighlight}
                onSelect={selectActor}
              />
        }
    </Page>
  );
}