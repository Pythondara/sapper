import { CreateGameSessionDto } from '../../game-session/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @ApiProperty({ description: 'Lines count' })
  @Min(1)
  @Max(6)
  n: number;

  @ApiProperty({ description: 'Diamond count' })
  @Min(1)
  m: number;

  @ApiProperty({ description: 'Game Session' })
  @ValidateNested()
  @Type(() => CreateGameSessionDto)
  gameSession: CreateGameSessionDto;
}
