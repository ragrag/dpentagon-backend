import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Expose()
  newPassword: string;
}
