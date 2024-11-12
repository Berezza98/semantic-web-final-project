export interface HTTPClient {
  get: <T>(endpoint: string, query: string) => Promise<T>;
}
