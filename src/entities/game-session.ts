import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game';
import { UserProgressDto } from '../dto';

@Entity('participants')
export class GameProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: false })
  firstUserProgress: UserProgressDto;

  @Column({ type: 'json', nullable: false })
  secondUserProgress: UserProgressDto;

  @OneToOne(() => Game, (game) => game.gameProgress)
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
