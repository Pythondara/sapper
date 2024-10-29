import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('')
  @ApiOperation({
    summary: 'Receive a list of users',
    description: 'Receive a list of users',
  })
  @ApiResponse({ status: '2XX', type: UserDto, isArray: true })
  async browse() {
    return this.service.browse();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Receive a user by id',
    description: 'Receive a user by id',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponse({ status: '2XX', type: UserDto })
  async read(@Param('id') id: string): Promise<UserDto> {
    return this.service.read(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Creating user',
    description: 'Creating user',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: '2XX', type: UserDto })
  async add(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.service.add(dto);
  }
}
