export const ROUTES = {
  MOVIE_LIST: 'MOVIE_LIST',
  ACTORS: 'ACTORS',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
