import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateCatalogueDTO {
  @IsString()
  @Expose()
  public name: string;
}
