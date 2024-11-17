import { createClient, RedisClientType } from 'redis';
import { injectable } from 'inversify';
import { CachingClient } from '../interfaces';

@injectable()
export class CachingService implements CachingClient {
  private client: RedisClientType;

  async connect() {
    this.client = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });

    this.client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    await this.client.connect();
  }

  async get<T>(key: string) {
    try {
      const cacheData = await this.client.get(key);

      if (cacheData === null) return null;

      return JSON.parse(cacheData) as T;
    } catch (e) {
      console.log('Get cache error: ', e);

      return null;
    }
  }

  async set(key: string, data: Record<PropertyKey, any>) {
    try {
      const dataToSave = JSON.stringify(data);

      if (!dataToSave) throw new Error('Nothing to Save in cache');

      await this.client.set(key, dataToSave, { EX: 60, NX: true });
    } catch (e) {
      console.log('Set cache error: ', e);
    }
  }
}
