import { Movie } from "./Movie";

interface GetMoviesArgs {
  limit?: number;
  offset?: number;
}

export interface DataProvider {
  getMovies: (args: GetMoviesArgs) => Promise<Movie[] | DataProviderError>;
}

export interface DataProviderError {
  status: number;
  message: string;
}