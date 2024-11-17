import { inject, injectable } from 'inversify';
import { Configurations, HTTPClient } from '../interfaces';
import { TYPES } from '../dependencyInjectionTypes';
import { HTTPError } from '../errors';

@injectable()
export class HTTPClientService implements HTTPClient {
  constructor(
    @inject(TYPES.Configurations) private configurations: Configurations
  ) {}

  async get<T>(endpoint: string, query: string) {
    try {
      const response = await fetch(
        `${this.configurations.baseUrl}${endpoint}${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new HTTPError(
          response.status,
          `Not OK: ${response.statusText};\n\n${responseText}`
        );
      }

      const json = await response.json();
      return json as T;
    } catch (e) {
      console.log(e);
      throw new HTTPError(400, 'Custom Http Error');
    }
  }
}
