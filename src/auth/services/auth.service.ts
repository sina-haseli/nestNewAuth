import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { BusinessService } from '../../base/business.service';
import { UserRepository } from '../../user/repositories/user.repository';
import RegisterDto from '../dto/requests/register.dto';
import * as bcrypt from 'bcrypt';
import { PostgresErrorCode } from '../enum/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { expireDuration, jwtSecret } from '../../config/jwt-secret';
import { CreateUserDto } from '../../user/dto/requests/create-user.dto';
import { RefreshTokenDto } from '../dto/requests/refresh-token.dto';
import { RedisClient } from '@nestjs/microservices/external/redis.interface';

@Injectable()
export class AuthService extends BusinessService<User> {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserRepository))
    private userService: UserRepository,
    @Inject('REDIS_CONNECTION') private redis: RedisClient,
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
    const expiresIn = expireDuration;
    const userInfo = { userId: userId, type: 'accessToken' };
    const token = this.jwtService.sign(userInfo);
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
      return await this.createToken(user.id);
    }
    throw new Error('User not found');
  }

  async findByPhoneNumber(phone_number: string) {
    return await this.userService.findByPhoneNumber(phone_number);
  }

  async authUserByPhoneNumber(userData: CreateUserDto) {
    const { phone_number, password } = userData;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log('register', hashPassword);
    const isUserExists = await this.checkUserExists(phone_number);
    if (isUserExists) {
      return 'User already exists';
    }

    // create a new user
    try {
      const user = await this.userService.save({
        phone_number: phone_number,
        password: hashPassword,
      });
      const token = await this.createPhoneNumberToken(user.phone_number);
      console.log(token);
      if (token) {
        return token;
      }
    } catch (error) {
      return 'Register failure';
    }
  }

  async onModuleInit() {
    this.redis.set('test', 'test');
    const test = this.redis.get('test');
    console.log(test);
  }

  async verifyPhoneNumber(userData: CreateUserDto) {
    const { phone_number, password } = userData;
    const user = await this.userService.findByPhoneNumber(phone_number);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      userId: user.id,
      type: 'accessToken',
    };
    const token = this.jwtService.sign(payload);
    this.redis.set(String(user.id), token);
    const redis = this.redis.get(token);
    console.log(redis);
    const refreshToken = await this.getJwtRefreshToken(user.id);
    return {
      access_token: { token, expiresIn: expireDuration },
      refresh_token: { refreshToken, expiresIn: '340d' },
    };
  }

  async getJwtRefreshToken(userId: number) {
    const user = await this.userService.findOne(userId);
    const payload = { userId: user.id, type: 'refreshToken' };
    const token = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '120d',
    });
    await this.userService.update(userId, { currentRefreshToken: token });
    return token;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const payload = this.jwtService.verify(refreshToken, { secret: jwtSecret });
    if (payload.type !== 'refreshToken') {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.currentRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const accessToken = await this.createToken(user.id);
    const newRefreshToken = await this.getJwtRefreshToken(user.id);
    return {
      access_token: accessToken,
      refresh_token: { newRefreshToken, expiresIn: '340d' },
    };
  }
}
