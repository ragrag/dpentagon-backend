import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Profession } from '../../../entities/profession.entity';

export class UpdateUserDTO {
  // @IsNotEmpty()
  // @IsEnum({
  //   company: 'company',
  //   personal: 'personal',
  // })
  // @Expose()
  // public userType: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  public professionId: number;

  public profession: Profession;

  @IsNotEmpty()
  @IsString()
  @Expose()
  public displayName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  public country: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  @IsOptional()
  @Expose()
  public phoneNumber: string;

  @IsNotEmpty()
  @IsOptional()
  @Expose()
  public profileInfo: string;
}
