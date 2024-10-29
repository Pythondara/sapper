import { IsNumber, IsString } from 'class-validator';

export class ConfigDto {
  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  clientUrl: string;

  @IsString()
  swaggerFolder: string;

  @IsString()
  logsFolder: string;
}
