import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GameSessionService } from './game-session/game-session.service';
import { GameSessionModule } from './game-session/game-session.module';
import { GameService } from './game/game.service';

@Module({
  imports: [
    UserModule,
    GameModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      useFactory: () => {
        return {
          type: 'sqlite',
          database: 'db',
          entities: [
            join(__dirname, '/**/*.entity{.ts,.js}'),
            join(__dirname, 'entities/**/*.{js,ts}'),
          ],
          synchronize: true,
        };
      },
      inject: [],
    }),
    GameSessionModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, GameSessionService, GameService],
})
export class AppModule {}
