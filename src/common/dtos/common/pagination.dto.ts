import { Expose } from 'class-transformer';
import { IsNumberString, IsNotEmpty } from 'class-validator';

export class PaginationDTO {
  @IsNotEmpty()
  @IsNumberString()
  @Expose()
  public page = '1';

  @IsNotEmpty()
  @IsNumberString()
  @Expose()
  public limit = '20';
}
