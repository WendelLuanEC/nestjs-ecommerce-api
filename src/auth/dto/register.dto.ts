import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Alice Doe', description: 'User full name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'alice@example.com', description: 'Valid email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Password with minimum 6 characters' })
  @MinLength(6)
  password: string;
}
