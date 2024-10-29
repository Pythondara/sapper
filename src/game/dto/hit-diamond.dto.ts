import { ApiProperty } from '@nestjs/swagger';

export class FieldCoordinatesDto {
  @ApiProperty()
  x: number;
  @ApiProperty()
  y: number;
}
