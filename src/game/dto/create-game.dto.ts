import { CreateGameSessionDto } from '../../game-session/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGameDto {
  @ApiProperty()
  @Max(6)
  @Min(1)
  fieldLineCount: number;

  @ApiProperty()
  @Min(1)
  @Max(36)
  diamonds: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateGameSessionDto)
  gameSession: CreateGameSessionDto;
}
