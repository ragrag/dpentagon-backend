import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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
}
