import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as redisStore from 'cache-manager-redis-store';

export const clientModuleConfig = {
  store: redisStore,
  host: 'localhost',
  port: 6379,
};

export const microServiceOptions: MicroserviceOptions = {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
};
