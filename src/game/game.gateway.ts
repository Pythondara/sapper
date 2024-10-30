import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { CreateGameDto } from './dto';
import { HitDiamondWebsocketDto } from './dto/websocket/hit-diamond.websocket.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway(8001, { cors: { origin: '*' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly service: GameService) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    this.logger.log({ message: 'New user connected', data: client.id });
  }

  handleDisconnect(client: Socket) {
    this.logger.log({ message: 'User disconnected', data: client.id });
  }

  @SubscribeMessage('browseGames')
  async browse() {
    return this.service.browse();
  }

  @SubscribeMessage('createGame')
  async add(@MessageBody() dto: CreateGameDto) {
    const gameEvent = await this.service.add(dto);

    this.server.emit('gameCreated', { gameEvent });

    return gameEvent;
  }

  @SubscribeMessage('hitCells')
  async hitCells(@MessageBody() dto: HitDiamondWebsocketDto) {
    const gameEvent = await this.service.hitCell(dto.id, dto);

    this.server.emit('cellsHit', { gameEvent });
  }
}
