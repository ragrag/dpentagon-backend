import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @Expose()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  public password: string;
}
