import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export default class RegisterDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
