import { useContext } from "react";
import { routerContext } from "../contexts/RouterContext.js";
import { Route } from "../consts/routes.js";

export const useNavigate = () => {
  const context = useContext(routerContext);

  return (route: Route, navigationData?: unknown) =>
    context.navigate(route, navigationData);
};
