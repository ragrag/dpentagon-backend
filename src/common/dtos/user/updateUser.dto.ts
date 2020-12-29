import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

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
  @Expose()
  public phoneNumber: string;
}
