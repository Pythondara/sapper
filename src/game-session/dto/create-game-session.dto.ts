import { UserProgressDto } from '../../dto';
import { GameDto } from '../../game/dto';

export class CreateGameProgressDto {
  firstUserProgress: UserProgressDto;
  secondUserProgress: UserProgressDto;
  game: GameDto;
}
