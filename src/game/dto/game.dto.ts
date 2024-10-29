import { GameSessionDto } from '../../game-session/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Max, Min } from 'class-validator';
import { GameFieldDto } from './game-field.dto';

export class GameDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  field: Array<Array<GameFieldDto>>;

  @ApiProperty()
  @Min(1)
  @Max(36)
  diamonds: number;

  @ApiProperty()
  gameSession: GameSessionDto;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
