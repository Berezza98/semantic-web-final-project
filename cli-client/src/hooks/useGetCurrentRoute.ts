import { useContext } from "react"
import { routerContext } from "../contexts/RouterContext.js"

export const useGetCurrentRoute = () => {
  const context = useContext(routerContext);

  return context.currentRoute;
}