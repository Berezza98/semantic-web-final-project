import { useContext } from 'react';
import { routerContext } from '../contexts/RouterContext.js';

export const useNavigate = () => {
  const context = useContext(routerContext);

  return {
    navigate: context.navigate,
    back: context.back,
    changeCurrentRouteData: context.changeCurrentRouteData,
  };
};
