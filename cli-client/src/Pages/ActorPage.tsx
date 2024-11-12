import { Box, Newline, Text, useInput } from "ink"
import { Page } from "../components/Page.js"
import { useNavigate } from "../hooks/useNavigate.js";
import { useGetCurrentRouteData, useQuery } from "../hooks/index.js";
import { getActorInformation } from "../api/getActorInformation.js";
import { Actor } from "../interfaces/Actor.js";

export const ActorPage = () => {
  const { back } = useNavigate();
  const routerData = useGetCurrentRouteData<Actor>();

  const actorInfoQuery = useQuery({
    queryFn: async () => getActorInformation(routerData.urlName),
    cacheKey: `actor_${routerData.urlName}`,
  });

  useInput((input, key) => {
		if (key.delete) {
      back();
    }
	});

  return (
    <Page title="Actor Page" isLoading={actorInfoQuery.isLoading}>
      {
        actorInfoQuery.error && (
          <Text color="red">Loading error</Text>
        )
      }
      {
        actorInfoQuery.data && (
          <Box flexDirection="column">
            <Text color="green">Name: <Text color="blue">{actorInfoQuery.data.name}</Text></Text>
            <Newline />
            <Text color="green">Birth date: <Text color="blue">{actorInfoQuery.data.birthDate}</Text></Text>
            <Newline />
            <Text color="green">Birth place: <Text color="blue">{actorInfoQuery.data.birthPlace}</Text></Text>
            <Newline />
            <Text color="green">Nationality: <Text color="blue">{actorInfoQuery.data.nationality}</Text></Text>
            <Newline />
            <Text color="green">Short biography: <Text color="blue">{actorInfoQuery.data.abstract}</Text></Text>
          </Box>
        )
      }
    </Page>
  )
}