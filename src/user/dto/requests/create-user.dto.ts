import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsInt()
  otp_code: number;

  @IsNotEmpty()
  @Min(11)
  @Max(12)
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  password: string;
  @IsNotEmpty()
  @IsString()
  @Min(8)
  repeat_password: string;

  @IsNotEmpty()
  @IsString()
  uuid_code: string;
}
