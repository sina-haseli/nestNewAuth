import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessEntity } from '../../base/business.entity';
import { IsNotEmpty } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsNotEmpty()
  @ApiHideProperty()
  password: string;

  @Column({ unique: true, nullable: true })
  phone_number: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  currentRefreshToken?: string;
}
