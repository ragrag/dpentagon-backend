import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDTO {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
