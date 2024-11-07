import React, { FC, createContext, useCallback, useMemo, useState } from "react";
import { Route, ROUTES } from "../consts/index.js";

interface RouterValue {
  currentRoute: Route;
  navigate: (route: Route) => void;
}

const value: RouterValue = {
  currentRoute: ROUTES.HOME,
  navigate: () => {},
} 

export const routerContext = createContext<RouterValue>(value);

export const RouterContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>(ROUTES.HOME);

  const navigate = useCallback((route: Route) => {
    setCurrentRoute(route);
  }, [setCurrentRoute]);

  const value = useMemo<RouterValue>(() => {
    return {
      currentRoute,
      navigate,
    };
  }, [currentRoute, navigate]);

  return (
    <routerContext.Provider value={value}>
      {children}
    </routerContext.Provider>
  );
}