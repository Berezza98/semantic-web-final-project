import { apiClient } from './client.js';
import { FullActorInformation } from '../interfaces/index.js';

export async function getActorInformation(
  actorName: string
): Promise<FullActorInformation> {
  const response = await apiClient.get<FullActorInformation>(
    `/get-actor?actorUrlName=${actorName}`
  );

  return response.data;
}
