import React, { FC, createContext, useCallback, useMemo, useState } from "react";
import { Route, ROUTES } from "../consts/index.js";

interface RouterValue {
  currentRoute: Route;
  navigate: (route: Route, navigationData: unknown) => void;
  currentRouteData: unknown;
}

const value: RouterValue = {
  currentRoute: ROUTES.HOME,
  navigate: () => {},
  currentRouteData: undefined,
} 

export const routerContext = createContext<RouterValue>(value);

export const RouterContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(ROUTES.HOME);
  const [currentRouteData, setCurrentRouteData] = useState<unknown>();

  const navigate = useCallback((route: Route, navigationData?: unknown) => {
    setCurrentRoute(route);
    setCurrentRouteData(navigationData);
  }, [setCurrentRoute]);

  const value = useMemo<RouterValue>(() => {
    return {
      currentRoute,
      navigate,
      currentRouteData
    };
  }, [currentRoute, navigate, currentRouteData]);

  return (
    <routerContext.Provider value={value}>
      {children}
    </routerContext.Provider>
  );
}