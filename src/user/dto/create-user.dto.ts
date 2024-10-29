import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(3)
  username: string;
}
