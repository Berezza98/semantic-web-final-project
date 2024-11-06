import { useApp, useInput } from 'ink';
import { Home } from './Pages/Home.js';
import { ErrorPage } from './Pages/Error.js';
import { useGetCurrentRoute } from './hooks/index.js';
import { ROUTES } from './consts/index.js';

export const App = () => {
  const { exit } = useApp();
  const currentRoute = useGetCurrentRoute();

  useInput((input, key) => {
		if (input === 'q') {
			exit();
		}

		if (key.leftArrow) {
			// Left arrow key pressed
		}
	});

  if (currentRoute === ROUTES.HOME) return <Home />;

  return <ErrorPage />;
}