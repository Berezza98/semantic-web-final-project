import { useContext } from "react"
import { routerContext } from "../contexts/RouterContext.js"
import { Route } from "../consts/routes.js";

export const useNavigate = () => {
  const context = useContext(routerContext);

  return (route: Route) => context.navigate(route);
}