import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateCatalogueDTO {
  @IsString()
  @Expose()
  public name: string;
}
