import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty({ example: 'uuid-do-produto' })
  @IsUUID()
  productId: string;
}
