import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameSession } from './game-session';
import { GameFieldDto } from '../game/dto/game-field.dto';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  field: Array<Array<GameFieldDto>>;

  @Column({ type: 'integer', nullable: true })
  diamonds: number;

  @OneToOne(() => GameSession, (gameSession) => gameSession.game)
  @JoinColumn()
  gameSession: GameSession;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
