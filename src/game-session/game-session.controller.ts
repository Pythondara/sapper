import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameSessionService } from './game-session.service';
import { GameSessionDto } from './dto';

@Controller('game-session')
export class GameSessionController {
  constructor(private readonly service: GameSessionService) {}

  @Get('')
  @ApiOperation({
    summary: 'Receive a list of game sessions',
    description: 'Receive a list of game sessions',
  })
  @ApiResponse({ status: '2XX', type: GameSessionDto, isArray: true })
  async browse() {
    return this.service.browse();
  }
}
