import { forwardRef, Module, Scope } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { jwtSecret } from '../config/jwt-secret';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/repositories/user.repository';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { RedisConnection } from '../config/redis.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {
        expiresIn: '120d',
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'REDIS_CONNECTION',
      scope: Scope.DEFAULT,
      useFactory: () =>
        new RedisConnection().getInstance({
          REDIS_HOST: 'localhost',
          REDIS_PORT: 6379,
          REDIS_DB: 0,
        }),
    },
  ],
  exports: [PassportModule, AuthService, JwtStrategy],
})
export class AuthModule {}
