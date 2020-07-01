import {
  IsDefined,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length
} from 'class-validator';

import { Column } from 'typeorm';
import statesEnum from '../../../utils/enums/states';

export default class Address {
  @IsDefined()
  @IsString()
  @Column({ nullable: true })
  public streetNumber!: string;

  @IsDefined()
  @IsString()
  @Column({ nullable: true })
  public street!: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  public unitNumber!: string;

  @IsDefined()
  @IsString()
  @Column({ nullable: true })
  public city!: string;

  @IsDefined()
  @IsEnum(statesEnum)
  @Column('enum', { enum: statesEnum, nullable: true })
  public state!: statesEnum;

  @IsDefined()
  @IsNumberString() // must be a numeric string like '12345'
  @Length(5, 5)
  @Column({ nullable: true })
  public zipCode!: string;

  @IsString()
  @Column({ nullable: true })
  public formattedAddress!: string;
}
