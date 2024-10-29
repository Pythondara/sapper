import { UserProgressDataDto } from './user-progress-data.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserProgressDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ nullable: true, type: UserProgressDataDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => UserProgressDataDto)
  data?: UserProgressDataDto[];
}
