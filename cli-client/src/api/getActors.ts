import { apiClient } from './client.js';
import { Actor } from '../interfaces/index.js';

export async function getActors(movieName: string): Promise<Actor[]> {
  const response = await apiClient.get<Actor[]>(
    `/get-movie-actors?movieUrlName=${movieName}`
  );

  return response.data;
}
