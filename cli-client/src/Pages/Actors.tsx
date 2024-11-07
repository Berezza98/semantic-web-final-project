import { Text, useInput } from "ink";
import { useNavigate } from "../hooks/useNavigate.js";
import { ROUTES } from "../consts/routes.js";

export const ActorsPage = () => {
  const navigate = useNavigate();

  useInput((input, key) => {
		if (key.delete) {
      navigate(ROUTES.HOME);
    }
	});

  return (
    <Text>Actors Page</Text>
  );
}