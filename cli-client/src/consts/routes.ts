export const ROUTES = {
  HOME: 'HOME',
} as const;

export type ROUTE = typeof ROUTES[keyof typeof ROUTES];