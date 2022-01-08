import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessEntity } from '../../base/business.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @BeforeInsert()
  // hashPassword() {
  //   this.password = bcrypt.hashSync(
  //     this.password,
  //     bcrypt.genSaltSync(10),
  //     null,
  //   );
  // }
  @Column({ nullable: true })
  @IsNotEmpty()
  @ApiHideProperty()
  password: string;

  @Column({ unique: true, nullable: true })
  phone_number: string;
}
