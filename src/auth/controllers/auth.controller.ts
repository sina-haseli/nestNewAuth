import { Body, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { BusinessController } from '../../common/decorator/business-controller.decorator';
import { CreateUserDto } from '../../user/dto/requests/create-user.dto';
import { RefreshTokenDto } from '../dto/requests/refresh-token.dto';

@BusinessController('/auth', 'Authentication')
export class AuthController {
  constructor(
    private authService: AuthService, // private jwtService: JWTService,
  ) {}

  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return this.authService.authUserByPhoneNumber(userData);
  }

  @Post('/verify-phone-number')
  async verifyPhoneNumber(@Body() userData: CreateUserDto) {
    return this.authService.verifyPhoneNumber(userData);
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }
}
