import { Expose } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class GetPostsDTO {
  @IsString()
  @Expose()
  public profession: string;

  @IsString()
  @Expose()
  public country: string;

  @IsString()
  @Expose()
  public caption: string;

  @IsString()
  @IsEnum({
    freelancer: 'freelancer',
    company: 'company',
  })
  @Expose()
  public userType: string;
}
