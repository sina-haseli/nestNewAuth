// import { Global, Module, Scope } from '@nestjs/common';
// import { RedisConnection } from '../config/redis.config';
// import { RedisService } from './redis.service';
// import { ClientsModule } from '@nestjs/microservices';
//
// @Global()
// @Module({
//   imports: [ClientsModule.register()],
//   providers: [
//     RedisService,
//     {
//       provide: 'REDIS_SERVICE',
//       scope: Scope.DEFAULT,
//       useFactory: (config) =>
//         new RedisConnection().getInstance({
//           host: config.host,
//           port: config.port,
//           db: config.db,
//         }),
//     },
//   ],
//   exports: [RedisService],
// })
// export class RedisModule {}
