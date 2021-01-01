import { Expose } from 'class-transformer';
import { IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  @Expose()
  public token: string;
}
