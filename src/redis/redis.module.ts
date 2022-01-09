import { CacheModule, Global, Module } from '@nestjs/common';
import { clientModuleConfig } from '../config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [CacheModule.register(clientModuleConfig)],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
