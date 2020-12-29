import { Expose } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhotoPostDTO {
  @IsString()
  @Expose()
  public caption: string;

  @IsNotEmpty()
  @IsBase64()
  @Expose()
  public content: string;
}
