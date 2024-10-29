import { UserProgressStatusEnum } from './user-progress-status.enum';
import { UserProgressMoveDto } from './user-progress-move.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserProgressDataDto {
  @ApiProperty({ enum: UserProgressStatusEnum })
  status: UserProgressStatusEnum;

  @ApiProperty()
  moveQueue: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => UserProgressMoveDto)
  move: UserProgressMoveDto;

  @ApiProperty()
  diamondCount: number;
}
