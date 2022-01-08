import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/typeOrm.config';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), AuthModule, UserModule],
})
export class AppModule {}
