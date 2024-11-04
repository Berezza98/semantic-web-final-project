import { DataProvider } from "../dataProvider";

export interface GetMoviesQuery {
  limit: number;
  offset: number;
}

export type GetMoviesReply = Awaited<ReturnType<DataProvider['getMovies']>>;