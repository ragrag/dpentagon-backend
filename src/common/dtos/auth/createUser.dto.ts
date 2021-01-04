import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  public password: string;

  @IsNotEmpty()
  @IsEnum({
    company: 'company',
    freelancer: 'freelancer',
  })
  @Expose()
  public userType: string;

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
