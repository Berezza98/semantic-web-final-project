export const ROUTES = {
  HOME: 'HOME',
  ACTORS: 'ACTORS',
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];