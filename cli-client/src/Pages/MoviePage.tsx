import { Box, Newline, useInput, Text } from "ink"
import { Page } from "../components/Page.js"
import { useGetCurrentRouteData } from "../hooks/useGetCurrentRouteData.js";
import { useNavigate } from "../hooks/useNavigate.js";
import { useQuery } from "../hooks/useQuery.js";
import { Movie } from "../interfaces/Movie.js";
import { getMovieInformation } from "../api/getMovieInformation.js";
import { useMemo } from "react";
import { ROUTES } from "../consts/routes.js";

export const MoviePage = () => {
  const { back, navigate } = useNavigate();
  const routerData = useGetCurrentRouteData<Movie>();

  const movieInfoQuery = useQuery({
    queryFn: async () => getMovieInformation(routerData.urlName),
    cacheKey: `movie_${routerData.urlName}`,
  });

  const formatterRuntime = useMemo<number | string>(() => {
    if (
      !movieInfoQuery.data ||
      !movieInfoQuery.data.runtime ||
      Number.isNaN(parseInt(movieInfoQuery.data.runtime))
    ) return '-';

    return parseInt(movieInfoQuery.data.runtime) / 60;
  }, [movieInfoQuery.data]);

  useInput((input, key) => {
		if (key.delete) {
      back();
    }

    if (key.downArrow) {
      navigate(ROUTES.ACTOR_LIST, routerData);
    }
	});

  return (
    <Page title="Movie Page" isLoading={movieInfoQuery.isLoading}>
      {
        movieInfoQuery.error && (
          <Text color="red">Loading error</Text>
        )
      }
      {
        movieInfoQuery.data && (
          <Box flexDirection="column">
            <Text color="green">Name: <Text color="blue">{movieInfoQuery.data.name}</Text></Text>
            <Newline />
            <Text color="green">Genre: <Text color="blue">{movieInfoQuery.data.genre}</Text></Text>
            <Newline />
            <Text color="green">Director: <Text color="blue">{movieInfoQuery.data.director}</Text></Text>
            <Newline />
            <Text color="green">Producer: <Text color="blue">{movieInfoQuery.data.producer}</Text></Text>
            <Newline />
            <Text color="green">Release Date: <Text color="blue">{movieInfoQuery.data.releaseDate}</Text></Text>
            <Newline />
            <Text color="green">Runtime: <Text color="blue">{formatterRuntime} minutes</Text></Text>
            <Newline />
            <Text color="green">Short Description: <Text color="blue">{movieInfoQuery.data.descr}</Text></Text>
            <Newline />
            <Box borderStyle="classic" borderColor="yellow" justifyContent="center">
              <Text>Press Arrow Down ⬇ to see actors list</Text>
            </Box>
          </Box>
        )
      }
    </Page>
  )
}