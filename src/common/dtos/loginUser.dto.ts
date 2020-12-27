import { IsEmail, IsString, IsNotEmpty, ValidateIf, IsAlphanumeric, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}
