import { Expose } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPhotoDTO {
  @IsNotEmpty()
  @IsString()
  @IsBase64()
  @Expose()
  photo: string;
}
