import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly clientService: Cache) {}
  async get(key): Promise<any> {
    return await this.clientService.get(key);
  }

  async set(key, value) {
    await this.clientService.set(key, value, 1000);
  }

  async reset() {
    await this.clientService.reset();
  }

  async del(key) {
    await this.clientService.del(key);
  }
}
