import { UserProgressDto } from '../../dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameSessionDto {
  @ApiProperty({ description: 'Info about first user' })
  @ValidateNested()
  @Type(() => UserProgressDto)
  firstUserProgress: UserProgressDto;

  @ApiProperty({ description: 'Info about second user' })
  @ValidateNested()
  @Type(() => UserProgressDto)
  secondUserProgress: UserProgressDto;
}
