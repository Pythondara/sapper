import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateGameDto, HitDiamondDto, GameDto } from './dto';

@Controller('game')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('')
  @ApiOperation({
    summary: 'Receive a list of game sessions',
    description: 'Receive a list of game sessions',
  })
  @ApiResponse({ status: '2XX', type: GameDto, isArray: true })
  async browse() {
    return this.service.browse();
  }

  @Post('')
  @ApiOperation({
    summary: 'Creating a game',
    description: 'Creating a new game',
  })
  @ApiBody({ type: CreateGameDto })
  @ApiResponse({ status: '2XX', type: GameDto })
  async add(@Body() dto: CreateGameDto): Promise<GameDto> {
    return this.service.add(dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Receive a game by id',
    description: 'Receive a game by id',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({ status: '2XX', type: GameDto })
  async read(@Param('id') id: string): Promise<GameDto> {
    return this.service.read(id);
  }

  @Post('hit/:id/cell')
  @ApiOperation({
    summary: 'Hitting a cell',
    description: 'Hitting a cell',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiBody({ type: HitDiamondDto })
  @ApiResponse({ status: '2XX', type: GameDto })
  async hitCell(@Param('id') id: string, @Body() dto: HitDiamondDto) {
    return this.service.hitCell(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deleting a cell',
    description: 'Soft delete a cell',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({ status: '2XX' })
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Restoring a cell',
    description: 'Restoring a cell',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({ status: '2XX' })
  async restore(@Param('id') id: string) {
    return this.service.restore(id);
  }
}
