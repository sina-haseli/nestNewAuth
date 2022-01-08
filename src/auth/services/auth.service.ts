import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { BusinessService } from '../../base/business.service';
import { UserRepository } from '../../user/repositories/user.repository';
import RegisterDto from '../dto/requests/register.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../enum/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { expireDuration, jwtSecret } from '../../config/jwt-secret';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService extends BusinessService<User> {
  transport;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserRepository))
    private userService: UserRepository,
  ) {
    super(userService);
  }

  async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.save({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUserExists(phone_number: string): Promise<boolean> {
    const user = await this.userService.findOne({
      where: { phone_number: phone_number },
    });
    return user !== undefined;
  }

  async create(user: User): Promise<User> {
    return await this.userService.save(user);
  }

  async createToken(userId: number) {
    const expiresIn = expireDuration,
      secretOrKey = jwtSecret;
    const userInfo = { userId: userId, type: 'accessToken' };
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
      const token = await this.createToken(user.id);
      return token.access_token;
    }
    return null;
  }

  async findByPhoneNumber(phone_number: string) {
    return await this.userService.findByPhoneNumber(phone_number);
  }
}
