export const ROUTES = {
  MOVIE_LIST: 'MOVIE_LIST',
  ACTOR_LIST: 'ACTOR_LIST',
  ACTOR: 'ACTOR',
  MOVIE: 'MOVIE',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
