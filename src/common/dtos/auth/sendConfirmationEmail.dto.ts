import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendConfirmationEmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Expose()
  public email: string;
}
