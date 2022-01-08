import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessEntity } from '../../base/business.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';

@Entity()
export class User extends BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  }
  @Column({ nullable: true })
  @IsNotEmpty()
  @ApiHideProperty()
  password: string;

  @Column({ unique: true })
  phone_number: string;
}
