import { Text, useInput } from "ink"
import { Page } from "../components/Page.js"
import { useNavigate } from "../hooks/useNavigate.js";

export const ActorPage = () => {
  const { back } = useNavigate();

  useInput((input, key) => {
		if (key.delete) {
      back();
    }
	});

  return (
    <Page title="Actor Page" isLoading={false}>
      <Text>Імʼя: Роман</Text>
    </Page>
  )
}