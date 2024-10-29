import { GameDto } from '../../game/dto';
import { UserProgressDto } from '../../dto';
import { ApiProperty } from '@nestjs/swagger';

export class GameSessionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstUserProgress: UserProgressDto;

  @ApiProperty()
  secondUserProgress: UserProgressDto;
  game: GameDto;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
