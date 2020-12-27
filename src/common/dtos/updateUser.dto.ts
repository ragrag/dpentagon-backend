import { IsString, IsBase64 } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  displayName: string;

  @IsString()
  profileInfo: string;

  @IsBase64()
  photo: string;
}
