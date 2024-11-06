import React, { FC, createContext, useMemo, useState } from "react";
import { ROUTE, ROUTES } from "../consts/index.js";

interface RouterValue {
  currentRoute: ROUTE;
}

const value: RouterValue = {
  currentRoute: ROUTES.HOME,
} 

export const routerContext = createContext<RouterValue>(value);

export const RouterContext: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState(ROUTES.HOME);

  const value = useMemo<RouterValue>(() => {
    return {
      currentRoute,
    };
  }, []);

  return (
    <routerContext.Provider value={value}>
      {children}
    </routerContext.Provider>
  );
}