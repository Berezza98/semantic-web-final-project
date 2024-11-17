export interface CachingClient {
  connect: () => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, data: Record<PropertyKey, any>) => Promise<void>;
}
