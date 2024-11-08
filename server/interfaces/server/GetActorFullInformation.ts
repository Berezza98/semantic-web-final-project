import { DataProvider } from '../dataProvider';

export interface GetActorFullInformationQuery {
  actorUrlName: string;
}

export type GetActorFullInformationReply = Awaited<
  Promise<DataProvider['getActorFullInformation']>
>;
