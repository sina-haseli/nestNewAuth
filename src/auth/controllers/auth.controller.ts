import {
  Body,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { User } from '../../user/entities/user.entity';
import { BusinessController } from '../../common/decorator/business-controller.decorator';
import { CreateUserDto } from '../../user/dto/requests/create-user.dto';
import { JWTService } from '../services/jwt.service';

@BusinessController('/google', 'Authentication')
export class AuthController {
  constructor(
    private authService: AuthService, // private jwtService: JWTService,
  ) {}

  // @UseGuards(AuthGuard('local'))
  // @Post('login')
  // async login(@Req() req) {
  //   const user = await this.authService.findById(req.user.id);
  //   user.updated_time = new Date();
  //   await this.authService.save(user, null);
  //   const data = await this.authService.login(req.user);
  //   return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, data);
  // }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    const entity = Object.assign(new User(), userData);

    // check user exist
    const isUserExists = await this.authService.checkUserExists(
      entity.phone_number,
    );
    if (isUserExists) {
      return 'User already exists';
    }

    // create a new user
    try {
      const user = await this.authService.create(entity);
      const token = await this.authService.createPhoneNumberToken(
        user.phone_number,
      );
      console.log(token);
      // const sent = await this.authService.sendVerifyEmail(user.email, token);

      // if (sent) {
      //   return new ResponseSuccess(ResponseCode.RESULT_SUCCESS);
      // } else {
      //   return new ResponseError(ResponseCode.RESULT_FAIL, 'Email not sent');
      // }
    } catch (error) {
      // return new ResponseError(ResponseCode.RESULT_FAIL, 'Register failure');
      return error;
    }
  }

  @Get('email/verify/:token')
  async verifyEmail(@Param('token') token: number) {
    try {
      // const isEmailVerified = await this.authService.verifyEmail(token);
      // return new ResponseSuccess(ResponseCode.RESULT_SUCCESS, isEmailVerified);
    } catch (error) {
      // return new ResponseSuccess(ResponseCode.RESULT_FAIL, error);
      return error;
    }
  }
}
