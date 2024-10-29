import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GameSession } from '../entities';
import { CreateGameSessionDto } from './dto';

@Injectable()
export class GameSessionService {
  private readonly logger = new Logger(GameSessionService.name);
  private readonly gameSessionRepository: Repository<GameSession>;

  constructor(private dataSource: DataSource) {
    this.gameSessionRepository = this.dataSource.getRepository(GameSession);
  }

  async browse() {
    this.logger.log({ message: 'Receiving a game sessions....' });

    const gameSession = await this.gameSessionRepository.find();

    this.logger.log({ message: 'Game sessions successfully received' });

    return gameSession;
  }

  async read(id: string) {
    this.logger.log({ message: 'Finding a game session....', data: id });

    const gameSession = await this.gameSessionRepository.findOne({
      where: { id },
    });

    if (!gameSession) {
      this.logger.error({
        message: 'Game session does not exists',
      });

      throw new BadRequestException({
        message: 'Game session does not exists',
      });
    }

    this.logger.log({
      message: 'Game session successfully found',
      data: gameSession.id,
    });

    this.logger.debug({
      message: 'Game session successfully found',
      data: gameSession,
    });

    return gameSession;
  }

  async edit(dto: CreateGameSessionDto, id: string) {
    const gameSession = await this.read(id);

    this.logger.log({ message: 'Editing a game session....', data: id });

    this.logger.debug({ message: 'Editing a game session....', data: dto });

    gameSession.firstUserProgress = dto.firstUserProgress;
    gameSession.secondUserProgress = dto.secondUserProgress;

    await this.gameSessionRepository.save(gameSession).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while editing a game session',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while editing a game session',
        data: err,
      });
    });

    this.logger.log({
      message: 'Game session successfully edited',
      data: gameSession.id,
    });

    this.logger.debug({
      message: 'Game session successfully edited',
      data: gameSession,
    });

    return gameSession;
  }

  async add(dto: CreateGameSessionDto) {
    this.logger.log({ message: 'Creating a game session....' });

    this.logger.debug({ message: 'Creating a game session....', data: dto });

    const gameSession = new GameSession();
    gameSession.firstUserProgress = dto.firstUserProgress;
    gameSession.secondUserProgress = dto.secondUserProgress;

    await this.gameSessionRepository.save(gameSession).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while creating a game session',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while creating a game session',
        data: err,
      });
    });

    this.logger.log({
      message: 'Game session successfully created',
      data: gameSession.id,
    });

    this.logger.debug({
      message: 'Game session successfully created',
      data: gameSession,
    });

    return gameSession;
  }

  async delete(id: string) {}

  async restore(id: string) {}
}
