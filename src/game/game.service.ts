import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateGameDto, HitDiamondDto, GameDto, UpdateGameDto } from './dto';
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

  async browse() {
    this.logger.log({ message: 'Receiving a games....' });

    const game = await this.gameRepository.find({
      relations: ['gameSession'],
    });

    this.logger.log({ message: 'Games successfully received' });

    return game;
  }

  async hitCell(id: string, dto: HitDiamondDto) {
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

    game.field[dto.x][dto.y].status = 'opened';

    const updatedGame = await this.gameRepository.save(game);

    return updatedGame;
  }

  setUserProgress(
    user: UserProgressDto,
    dto: GameDto,
    coordinates: UserProgressMoveDto,
  ): UserProgressDataDto {
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

    return {
      status: hitStatus,
      moveQueue,
      diamondCount,
      move: coordinates,
    };
  }

  private generateField(lines: number, diamondsCount: number) {
    const field = Array.from({ length: lines }, () =>
      Array(lines).fill({ status: 'closed', value: false }),
    );
    const filledField = this.fillFieldWithDiamonds(field, diamondsCount, lines);

    return filledField;
  }

  private fillFieldWithDiamonds(
    field: Array<Array<GameFieldDto>>,
    diamondsCount: number,
    lines: number,
  ) {
    const placedDiamonds = new Set<any>(); // Используем Set для уникальности
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

    return field;
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

    console.log(game.field.length);

    return game;
  }

  async edit(dto: UpdateGameDto) {
    return dto;
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

    const field = this.generateField(dto.fieldLineCount, dto.diamonds);

    const game = new Game();
    game.field = field;
    game.diamonds = dto.diamonds;
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
