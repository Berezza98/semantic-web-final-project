import { useContext } from "react"
import { routerContext } from "../contexts/RouterContext.js"

export const useSetCurrentRoute = (route: string) => {
  const context = useContext(routerContext);

  return context.currentRoute;
}