import * as jwt from 'jsonwebtoken';
import { jwtSecret, expireDuration } from '../../config/jwt-secret';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JWTService {
  constructor(@Inject() private readonly userService: UserService) {}

  async createToken(phone_number) {
    const expiresIn = expireDuration,
      secretOrKey = jwtSecret;
    const userInfo = { phone_number: phone_number };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(phone_number): Promise<User> {
    const userFromDb = await this.userService.findOne(phone_number);
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }


  async createPhoneNumberToken(phone_number: string) {
    const user = await this.findByPhoneNumber(phone_number);
    if (user) {
      const token = await this.createToken(phone_number);
      return token.access_token;
    }
    return null;
  }

  async findByPhoneNumber(phone_number: string) {
    return await this.userService.findByPhoneNumber(phone_number);
  }
}
