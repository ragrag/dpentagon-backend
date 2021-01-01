import { Expose } from 'class-transformer';
import { IsJWT, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Expose()
  public token: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  public password: string;
}
