import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      ...dto,
      password: hash,
    });
    return this.usersRepo.save(user);
  }

 async findByEmail(email: string): Promise<User | null> {
  return this.usersRepo.findOne({ where: { email } });
}


  async activate(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new Error('User not found');
    user.status = UserStatus.ACTIVE;
    return this.usersRepo.save(user);
  }
}
