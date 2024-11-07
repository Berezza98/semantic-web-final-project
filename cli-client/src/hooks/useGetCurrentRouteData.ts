import { useContext } from "react";
import { routerContext } from "../contexts/RouterContext.js";

export const useGetCurrentRouteData = <T = unknown>() => {
  const context = useContext(routerContext);

  return context.currentRouteData as T;
};
