import { FullMovieInformation, Movie } from './Movie';
import { Actor, FullActorInformation } from './Actor';

interface GetMoviesArgs {
  limit?: number;
  offset?: number;
}

export interface DataProvider {
  getMovies: (args: GetMoviesArgs) => Promise<Movie[] | DataProviderError>;
  getMovieFullInformation: (
    movieName: string
  ) => Promise<FullMovieInformation | DataProviderError>;
  getMovieActors: (movieName: string) => Promise<Actor[] | DataProviderError>;
  getActorFullInformation: (
    actorName: string
  ) => Promise<FullActorInformation | DataProviderError>;
}

export interface DataProviderError {
  status: number;
  message: string;
}
