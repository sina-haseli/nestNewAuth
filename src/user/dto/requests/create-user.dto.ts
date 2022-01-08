import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
