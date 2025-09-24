import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

async register(dto: any) {
  const user = await this.usersService.create(dto);
  const createdUser = Array.isArray(user) ? user[0] : user;
  await this.mailService.sendConfirmationEmail(createdUser.email);
  return { message: 'User created. Please confirm your email.' };
}

async confirmEmail(email: string) {
  await this.usersService.activate(email);
}

}
