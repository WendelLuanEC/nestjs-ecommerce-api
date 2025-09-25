import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsInt } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Notebook Dell Inspiron' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Notebook com processador i7, 16GB RAM e SSD de 512GB' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 4999.9 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  stock: number;
}
