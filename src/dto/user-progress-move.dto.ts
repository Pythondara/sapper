import { ApiProperty } from '@nestjs/swagger';

export class UserProgressMoveDto {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;
}
