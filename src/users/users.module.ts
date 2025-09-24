// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 👈 habilita o repositório
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // 👈 exporta para ser usado no AuthModule
})
export class UsersModule {}
