import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
