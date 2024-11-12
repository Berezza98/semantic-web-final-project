import { apiClient } from './client.js';
import { FullMovieInformation } from '../interfaces/index.js';

export async function getMovieInformation(
  movieName: string
): Promise<FullMovieInformation> {
  const response = await apiClient.get<FullMovieInformation>(
    `/get-movie?movieUrlName=${movieName}`
  );

  return response.data;
}
