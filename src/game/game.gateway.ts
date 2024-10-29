import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto, UpdateGameDto } from './dto';

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly service: GameService) {}

  @SubscribeMessage('browseGames')
  async browse() {
    return this.service.browse();
  }

  @SubscribeMessage('findOneGame')
  async read(@MessageBody() id: string) {
    return this.service.read(id);
  }

  @SubscribeMessage('editGame')
  async edit(@MessageBody() dto: UpdateGameDto) {
    return this.service.edit(dto);
  }

  @SubscribeMessage('createGame')
  async add(@MessageBody() dto: CreateGameDto) {
    return this.service.add(dto);
  }

  @SubscribeMessage('deleteGame')
  async delete(@MessageBody() id: string) {
    return this.service.delete(id);
  }

  @SubscribeMessage('restoreGame')
  async restore(@MessageBody() id: string) {
    return this.service.restore(id);
  }
}
