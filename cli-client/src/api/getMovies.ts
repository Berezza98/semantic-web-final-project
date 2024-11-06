import { apiClient } from "./client";
import { Movie } from "../interfaces";

export async function getMovies(page: number = 0): Promise<Movie[]> {
  const ITEMS_PER_PAGE = 10;

  const response = await apiClient.get<Movie[]>(`/get-movies?limit=${ITEMS_PER_PAGE}&offset=${page * ITEMS_PER_PAGE}`);
  
  return response.data;
}