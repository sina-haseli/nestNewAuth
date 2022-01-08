import { User } from '../../../../user/entities/user.entity';

export default class BaseCustomerUserResponseDto {
  constructor(data: User) {
    this.id = data.id;
    this.phoneNumber = data.phone_number;
  }

  id: number;
  phoneNumber: string;
}
