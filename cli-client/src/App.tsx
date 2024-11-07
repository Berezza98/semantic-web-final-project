import { useApp, useInput } from 'ink';
import { MoviesListPage } from './Pages/MoviesListPage.js';
import { ErrorPage } from './Pages/Error.js';
import { useGetCurrentRoute } from './hooks/index.js';
import { ROUTES } from './consts/index.js';
import { ActorsPage } from './Pages/Actors.js';

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

  if (currentRoute === ROUTES.MOVIE_LIST) return <MoviesListPage />;
  if (currentRoute === ROUTES.ACTORS) return <ActorsPage />;

  return <ErrorPage />;
}