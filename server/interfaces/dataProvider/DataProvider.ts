import { Movie } from "./Movie";
import { Actor } from "./Actor";

interface GetMoviesArgs {
  limit?: number;
  offset?: number;
}

export interface DataProvider {
  getMovies: (args: GetMoviesArgs) => Promise<Movie[] | DataProviderError>;
  getMovieActors: (movieName: string) => Promise<Actor[] | DataProviderError>;
}

export interface DataProviderError {
  status: number;
  message: string;
}