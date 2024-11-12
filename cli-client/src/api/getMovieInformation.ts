import { apiClient } from './client.js';
import { FullMovieInformation } from '../interfaces/index.js';

export async function getMovieInformation(
  actorName: string
): Promise<FullMovieInformation> {
  const response = await apiClient.get<FullMovieInformation>(
    `/get-movie?movieUrlName=${actorName}`
  );

  return response.data;
}
