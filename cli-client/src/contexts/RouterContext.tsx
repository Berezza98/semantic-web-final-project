import React, { FC, createContext, useCallback, useMemo, useState } from "react";
import { Route, ROUTES } from "../consts/index.js";

interface HistoryElement {
  route: Route;
  routeData: unknown;
}

interface RouterValue {
  currentRoute: Route;
  navigate: (route: Route, navigationData?: unknown) => void;
  back: () => void;
  currentRouteData: unknown;
}

const value: RouterValue = {
  currentRoute: ROUTES.MOVIE_LIST,
  navigate: () => {},
  back: () => {},
  currentRouteData: undefined,
}

const history: HistoryElement[] = [
  {
    route: ROUTES.MOVIE_LIST,
    routeData: null,
  }
];

export const routerContext = createContext<RouterValue>(value);

export const RouterContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(ROUTES.MOVIE_LIST);
  const [currentRouteData, setCurrentRouteData] = useState<unknown>();

  const navigate = useCallback((route: Route, navigationData?: unknown) => {
    const historyElement: HistoryElement = {
      route: route,
      routeData: navigationData,
    };

    history.push(historyElement);

    console.clear();
    setCurrentRoute(route);
    setCurrentRouteData(navigationData);
  }, [setCurrentRoute]);

  const back = useCallback(() => {
    if (history.length < 2) return;

    history.pop();
    const previousRoute = history[history.length - 1];

    const { route, routeData } = previousRoute;

    console.clear();
    setCurrentRoute(route);
    setCurrentRouteData(routeData);
  }, []);

  const value = useMemo<RouterValue>(() => {
    return {
      currentRoute,
      navigate,
      back,
      currentRouteData
    };
  }, [currentRoute, navigate, back, currentRouteData]);

  return (
    <routerContext.Provider value={value}>
      {children}
    </routerContext.Provider>
  );
}