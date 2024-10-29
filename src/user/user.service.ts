import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { User } from '../entities';
import { CreateUserDto, UserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly userRepository: Repository<User>;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async browse(): Promise<UserDto[]> {
    this.logger.log({ message: 'Receiving a users...' });

    const users: UserDto[] = await this.userRepository.find();

    this.logger.log({ message: 'Users successfully received' });

    return users;
  }

  async read(id: string, withDeleted = false): Promise<UserDto> {
    this.logger.log({ message: 'Receiving a user by id...', data: id });

    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted,
    });

    if (!user) {
      this.logger.error({
        message: 'User does not exists',
      });

      throw new BadRequestException({
        message: 'User does not exists',
      });
    }

    this.logger.log({ message: 'User successfully received', data: user.id });

    this.logger.debug({ message: 'User successfully received', data: user });

    return user;
  }

  async readArray(ids: string[], withDeleted = false): Promise<UserDto[]> {
    this.logger.log({ message: 'Receiving a user by ids...' });

    const users = await this.userRepository.find({
      where: { username: In(ids) },
      withDeleted,
    });

    // TODO реализовать проверку для каждого пользователя
    if (users.length < 2) {
      this.logger.error({
        message: 'Users does not exists',
      });

      throw new BadRequestException({
        message: 'Users does not exists',
      });
    }

    this.logger.log({ message: 'Users successfully received', data: users });

    this.logger.debug({ message: 'Users successfully received', data: users });

    return users;
  }
  async edit(dto: CreateUserDto, id: string): Promise<UserDto> {
    const user = await this.read(id);

    this.logger.log({ message: 'Editing a user', data: id });

    this.logger.debug({ message: 'Editing a user', data: dto });

    user.username = dto.username;

    await this.userRepository.save(user).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while editing a user',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while editing a user',
        data: err,
      });
    });

    return user;
  }

  async add(dto: CreateUserDto): Promise<UserDto> {
    this.logger.log({ message: 'Creating user...' });

    this.logger.debug({ message: 'Creating user', data: dto });

    const user = new User();
    user.username = dto.username;

    await this.userRepository.save(user).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while creating a user',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while creating a user',
        data: err,
      });
    });

    this.logger.log({ message: 'User successfully created', data: user.id });

    this.logger.debug({ message: 'User successfully created', data: user });

    return user;
  }

  async delete(id: string) {
    const user = await this.read(id, true);

    if (user.deletedAt != null) {
      this.logger.error({ message: 'User already deleted', data: user });

      throw new BadRequestException({ message: 'User already deleted' });
    }

    this.logger.log({ message: 'Soft removing a user', data: user.id });

    this.logger.debug({ message: 'Soft removing a user', data: user });

    await this.userRepository.softRemove(user).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while deleting a user',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while deleting a user',
        data: err,
      });
    });

    return { message: 'User successfully deleted' };
  }

  async restore(id: string) {
    const user = await this.read(id, true);

    if (user.deletedAt === null) {
      this.logger.error({ message: 'User already deleted', data: user });

      throw new BadRequestException({ message: 'User already deleted' });
    }

    this.logger.log({ message: 'Restoring a user', data: user.id });

    this.logger.debug({ message: 'Restoring a user', data: user });

    await this.userRepository.recover(user).catch((err) => {
      this.logger.error({
        message: 'Error retrieving while restoring a user',
        data: err,
      });

      throw new BadRequestException({
        message: 'Error retrieving while restoring a user',
        data: err,
      });
    });

    return { message: 'User successfully restored' };
  }
}
