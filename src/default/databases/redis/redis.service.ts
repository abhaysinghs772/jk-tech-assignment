import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';
import { ConsoleLogger } from 'src/default/logger/console/console.service';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(redisOptions: RedisOptions) {
    this.client = new Redis(redisOptions);
  }

  /**
   * Sets a key-value pair in Redis with optional TTL.
   * @param key - The key to set.
   * @param value - The value to set.
   * @param ttl - Time-to-live in seconds (optional).
   * @returns A promise resolving to 'OK' if successful.
   */
  async set(key: string, value: any, ttl?: number): Promise<'OK' | null> {
    ConsoleLogger.log(`Setting key ${key} with value ${value}`, 'RedisService');
    if (ttl) {
      return await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    }
    return await this.client.set(key, JSON.stringify(value));
  }

  /**
   * Gets a value from Redis and parses it into the expected type.
   * @param key - The key to get.
   * @returns A promise resolving to the parsed value or null if the key doesn't exist.
   */
  async get<T>(key: string): Promise<T | null> {
    ConsoleLogger.log(`Getting key ${key}`, 'RedisService');
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }

  /**
   * Deletes a key from Redis.
   * @param key - The key to delete.
   * @returns A promise resolving to the number of keys deleted.
   */
  async delete(key: string): Promise<number> {
    ConsoleLogger.log(`Deleting key ${key}`, 'RedisService');
    return this.client.del(key);
  }

  /**
   * Closes the Redis connection when the module is destroyed.
   */
  onModuleDestroy() {
    ConsoleLogger.log('Closing Redis connection', 'RedisService');
    this.client.quit();
  }
}
