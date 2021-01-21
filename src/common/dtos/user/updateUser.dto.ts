import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Profession } from '../../../entities/profession.entity';

export class UpdateUserDTO {
  // @IsNotEmpty()
  // @IsEnum({
  //   company: 'company',
  //   freelancer: 'freelancer',
  // })
  // @Expose()
  // public userType: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  public professionId: number;

  public profession: Profession;

  @IsNotEmpty()
  @IsString()
  @Expose()
  public displayName: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  public country: string;

  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber(null)
  @Expose()
  public phoneNumber: string;

  @IsOptional()
  @IsString()
  @Expose()
  public address: string;

  @IsOptional()
  @IsString()
  @Expose()
  public website: string;

  @IsOptional()
  @IsString()
  @Expose()
  public profileInfo: string;
}
