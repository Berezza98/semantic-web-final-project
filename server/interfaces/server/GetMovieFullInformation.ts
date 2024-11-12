import { DataProvider } from '../dataProvider';

export interface GetMovieFullInformationQuery {
  movieUrlName: string;
}

export type GetMovieFullInformationReply = Awaited<
  Promise<DataProvider['getMovieFullInformation']>
>;
