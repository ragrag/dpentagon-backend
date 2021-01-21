import { Expose } from 'class-transformer';
import { IsBase64, IsOptional, IsString } from 'class-validator';

export class UpdateCatalogueDTO {
  @IsString()
  @Expose()
  public name: string;

  @IsOptional()
  @IsString()
  @IsBase64()
  @Expose()
  public photo: string;
}
