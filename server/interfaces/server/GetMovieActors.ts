import { DataProvider } from "../dataProvider";

export interface GetMovieActorsQuery {
  movieUrlName: string;
}

export type GetMovieActorsReply = Awaited<Promise<DataProvider['getMovieActors']>>;