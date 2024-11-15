import React, { FC, createContext, useCallback, useMemo, useState } from "react";
import { Route, ROUTES } from "../consts/index.js";

interface HistoryElement {
  route: Route;
  routeData: Record<string, any>;
}

interface RouterValue {
  currentRoute: Route;
  navigate: (route: Route, navigationData?: HistoryElement['routeData']) => void;
  back: () => void;
  changeCurrentRouteData: (fn: (data: HistoryElement['routeData']) => HistoryElement['routeData']) => void;
  currentRouteData: any;
}

const value: RouterValue = {
  currentRoute: ROUTES.MOVIE_LIST,
  navigate: () => {},
  back: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeCurrentRouteData: (fn) => {},
  currentRouteData: {},
}

const history: HistoryElement[] = [
  {
    route: ROUTES.MOVIE_LIST,
    routeData: {},
  }
];

export const routerContext = createContext<RouterValue>(value);

export const RouterContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(ROUTES.MOVIE_LIST);
  const [currentRouteData, setCurrentRouteData] = useState<unknown>();

  const navigate = useCallback((route: Route, navigationData?: Record<PropertyKey, unknown>) => {
    const historyElement: HistoryElement = {
      route: route,
      routeData: navigationData ?? {},
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

  const changeCurrentRouteData = useCallback((fn: (data: HistoryElement['routeData']) => HistoryElement['routeData']) => {
    const currentRoute = history[history.length - 1];

    const data = fn(currentRoute.routeData);

    currentRoute.routeData = data;
    setCurrentRouteData(data);
  }, []);

  const value = useMemo<RouterValue>(() => {
    return {
      currentRoute,
      navigate,
      back,
      changeCurrentRouteData,
      currentRouteData
    };
  }, [currentRoute, navigate, back, changeCurrentRouteData, currentRouteData]);

  return (
    <routerContext.Provider value={value}>
      {children}
    </routerContext.Provider>
  );
}