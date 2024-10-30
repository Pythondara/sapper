import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateGameDto, HitDiamondDto, GameDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { Game } from '../entities';
import { GameSessionService } from '../game-session/game-session.service';
import { UserService } from '../user/user.service';
import { random } from 'lodash';
import { GameFieldDto } from './dto/game-field.dto';
import {
  UserProgressDto,
  UserProgressMoveDto,
  UserProgressStatusEnum,
} from '../dto';
import { UserProgressDataDto } from '../dto/user-progress-data.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private readonly gameRepository: Repository<Game>;

  constructor(
    private dataSource: DataSource,
    private readonly gameSessionService: GameSessionService,
    private readonly userService: UserService,
  ) {
    this.gameRepository = this.dataSource.getRepository(Game);
  }

  async hitCell(id: string, dto: HitDiamondDto) {
    this.logger.log({ message: 'Hitting a cell...' });

    const game = await this.read(id);

    let userProgressData: UserProgressDataDto;

    const firstUserProgress = game.gameSession.firstUserProgress;
    const secondUserProgress = game.gameSession.firstUserProgress;

    if (firstUserProgress.username === dto.username) {
      userProgressData = this.setUserProgress(firstUserProgress, game, {
        x: dto.x,
        y: dto.y,
      });

      firstUserProgress.data.push(userProgressData);
    } else if (secondUserProgress.username === dto.username) {
      userProgressData = this.setUserProgress(secondUserProgress, game, {
        x: dto.x,
        y: dto.y,
      });

      game.gameSession.firstUserProgress.data.push(userProgressData);
    }

    await this.gameSessionService.edit(game.gameSession, game.gameSession.id);

    game.field = this.openCells(game.field, dto.x, dto.y);

    this.logger.log({ message: 'Updating game entity....' });

    this.logger.debug({ message: 'Updating game entity....', data: game });

    const updatedGame = await this.gameRepository.save(game);

    this.logger.log({ message: 'Game updated successfully' });

    this.logger.debug({ message: 'Game updated successfully', data: game });

    return updatedGame;
  }

  private openCells(field: Array<Array<GameFieldDto>>, x: number, y: number) {
    this.logger.log({ message: 'Opening cells...' });

    if (x < 0 || y < 0 || x >= field.length || y >= field[0].length) {
      return field;
    }

    if (field[x][y].value === true) {
      const directions = [
        { dx: -1, dy: 0 }, // вверх
        { dx: 1, dy: 0 }, // вниз
        { dx: 0, dy: -1 }, // влеов
        { dx: 0, dy: 1 }, // вправо
      ];

      for (const { dx, dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;

        if (
          newX >= 0 &&
          newY >= 0 &&
          newX < field.length &&
          newY < field[0].length
        ) {
          if (field[newX][newY].value === false) {
            field[newX][newY].status = 'opened';
          }
        }
      }
    }

    this.logger.log({ message: 'Cells successfully opened' });

    this.logger.debug({ message: 'Cells successfully opened', data: field });

    return field;
  }

  private setUserProgress(
    user: UserProgressDto,
    dto: GameDto,
    coordinates: UserProgressMoveDto,
  ): UserProgressDataDto {
    this.logger.log({ message: 'Set up user progress....' });

    let hitStatus: UserProgressStatusEnum;
    let moveQueue: number = 0;
    let diamondCount: number;

    const field = dto.field[coordinates.x][coordinates.y];

    if (field.value === false) {
      hitStatus = UserProgressStatusEnum.MISS;
      diamondCount = dto.diamonds;
    } else {
      hitStatus = UserProgressStatusEnum.HIT;
      diamondCount = dto.diamonds - 1;
    }

    if (user.data.length < 1) {
      moveQueue += 1;
    } else {
      moveQueue = 1;
    }

    const res = {
      status: hitStatus,
      moveQueue,
      diamondCount,
      move: coordinates,
    };

    this.logger.log({ message: 'User progress successfully setup' });

    this.logger.debug({
      message: 'User progress successfully setup',
      data: res,
    });

    return res;
  }

  private generateField(lines: number, diamondsCount: number) {
    this.logger.log({ message: 'Generating field....' });

    const field = Array.from({ length: lines }, () =>
      Array(lines).fill({ status: 'closed', value: false }),
    );

    const filledField = this.fillFieldWithDiamonds(field, diamondsCount, lines);

    this.logger.log({ message: 'Field successfully generated' });

    return filledField;
  }

  private fillFieldWithDiamonds(
    field: Array<Array<GameFieldDto>>,
    diamondsCount: number,
    lines: number,
  ) {
    this.logger.log({ message: 'Filling field with diamonds....' });

    const placedDiamonds = new Set<any>();
    let diamonds = 0;

    while (diamonds < diamondsCount) {
      const x = random(0, lines - 1);
      const y = random(0, lines - 1);
      const key = `${x},${y}`;

      if (!placedDiamonds.has(key)) {
        placedDiamonds.add(key);
        field[x][y] = { status: 'closed', value: true };
        diamonds++;
      }
    }

    this.logger.log({ message: 'Field successfully filled' });

    this.logger.debug({ message: 'Field successfully filled', data: field });

    return field;
  }

  async browse() {
    this.logger.log({ message: 'Receiving a games....' });

    const game = await this.gameRepository.find({
      relations: ['gameSession'],
    });

    this.logger.log({ message: 'Games successfully received' });

    return game;
  }

  async read(id: string, withDeleted = false) {
    this.logger.log({ message: 'Receiving a game by id...', data: id });

    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['gameSession'],
      withDeleted,
    });

    if (!game) {
      this.logger.error({
        message: 'Game does not exists',
      });

      throw new BadRequestException({
        message: 'Game does not exists',
      });
    }

    this.logger.log({ message: 'Game successfully received', data: game.id });

    this.logger.debug({ message: 'Game successfully received', data: game });

    return game;
  }

  async add(dto: CreateGameDto): Promise<GameDto> {
    const usernames = [
      dto.gameSession.firstUserProgress.username,
      dto.gameSession.secondUserProgress.username,
    ];

    await this.userService.readArray(usernames);

    const gameSession = await this.gameSessionService.add(dto.gameSession);

    this.logger.log({ message: 'Creating a game....' });

    this.logger.debug({ message: 'Creating a game....', data: dto });

    const field = this.generateField(dto.n, dto.m);

    const game = new Game();
    game.field = field;
    game.diamonds = dto.m;
    game.gameSession = gameSession;

    await this.gameRepository.save(game).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while creating a game',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while creating a game',
        data: err,
      });
    });

    this.logger.log({ message: 'Game successfully created', data: game.id });

    this.logger.debug({ message: 'Game successfully created', data: game });

    return game;
  }

  async delete(id: string) {
    const game = await this.read(id);

    this.logger.log({ message: 'Deleting a game....', data: id });

    await this.gameRepository.softRemove(game).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while deleting a game',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while deleting a game',
        data: err,
      });
    });

    this.logger.log({ message: 'Game successfully deleted', data: game.id });
    this.logger.debug({ message: 'Game successfully deleted', data: game });

    return { message: `Game ${game.id} successfully deleted` };
  }

  async restore(id: string) {
    const game = await this.read(id, true);

    this.logger.log({ message: 'Restoring a game....', data: id });

    await this.gameRepository.recover(game).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while restoring a game',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while restoring a game',
        data: err,
      });
    });

    this.logger.log({ message: 'Game successfully restored', data: game.id });
    this.logger.debug({ message: 'Game successfully restored', data: game });

    return { message: `Game ${game.id} successfully restored` };
  }
}
