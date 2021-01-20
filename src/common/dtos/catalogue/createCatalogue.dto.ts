import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCatalogueDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @Expose()
  public name: string;
}
