import { Expose } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export class ObjectIdDTO {
  @IsNumberString()
  @Expose()
  public id: number;
}
