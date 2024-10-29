import { ApiProperty } from '@nestjs/swagger';

export class HitDiamondDto {
  @ApiProperty()
  x: number;

  @ApiProperty()
  y: number;

  @ApiProperty()
  username: string;
}
