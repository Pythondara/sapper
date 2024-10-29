import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameSessionModule } from '../game-session/game-session.module';
import { GameSessionService } from '../game-session/game-session.service';
import { GameController } from './game.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';

@Module({
  providers: [GameGateway, GameService, GameSessionService, UserService],
  imports: [GameSessionModule, UserModule],
  controllers: [GameController],
})
export class GameModule {}
