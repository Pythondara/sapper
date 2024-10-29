import { GameDto } from '../../game/dto';
import { UserProgressDto } from '../../dto';

export class GameProgressDto {
  id: string;
  firstUserProgress: UserProgressDto;
  secondUserProgress: UserProgressDto;
  game: GameDto;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
