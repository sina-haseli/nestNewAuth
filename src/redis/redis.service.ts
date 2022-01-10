import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CONNECTION') private clientService: RedisClient) {}

  async set(key: string, value: string) {
    return this.clientService.set(key, value);
  }

  async get(key: string) {
    return this.clientService.get(key);
  }

  async exists(key: string) {
    return this.clientService.exists(key);
  }

  async keys(pattern: string) {
    return this.clientService.keys(pattern);
  }

  async del(key: string) {
    return this.clientService.del(key);
  }

  async flushdb() {
    return this.clientService.flushdb();
  }

  async flushall() {
    return this.clientService.flushall();
  }

  async hmset(key: string, ...args: any[]) {
    return this.clientService.hmset(key, ...args);
  }

  async hmget(key: string, ...args: any[]) {
    return this.clientService.hmget(key, ...args);
  }

  async expire(key: string, seconds: number) {
    return this.clientService.expire(key, seconds);
  }
}
