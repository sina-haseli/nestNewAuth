// import { Inject, Injectable } from '@nestjs/common';
// import { RedisClient } from '@nestjs/microservices/external/redis.interface';
// import { ClientRedis } from '@nestjs/microservices';
//
// @Injectable()
// export class RedisService {
//   constructor(
//     @Inject('REDIS-SERVICE') private redisClient: ClientRedis,
//     @Inject('REDIS-CONNECTION') private clientService: RedisClient,
//   ) {}
//
//   async set(key: string, value: string) {
//     return this.clientService.set(key, value);
//   }
//
//   async get(key: string) {
//     return this.clientService.get(key);
//   }
//
// }
