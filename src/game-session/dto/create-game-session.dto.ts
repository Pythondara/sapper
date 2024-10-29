import { UserProgressDto } from '../../dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameSessionDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserProgressDto)
  firstUserProgress: UserProgressDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserProgressDto)
  secondUserProgress: UserProgressDto;
}
