import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: any) {
    const user = await this.usersService.create(dto);

    // Se create retorna um array, pegue o primeiro usuário
    const createdUser = Array.isArray(user) ? user[0] : user;

    // gerar token de ativação (expira em 1 dia)
    const token = this.jwtService.sign(
      { email: createdUser.email },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    );

    await this.mailService.sendConfirmationEmail(createdUser.email, token);

    return { message: 'User created. Please confirm your email.' };
  }

  async confirmEmail(token: string) {
    try {
      
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      await this.usersService.activate(payload.email);

      return { message: 'Email confirmado! Agora você pode fazer login.' };
    } catch (e) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) return null;

    if (user.status !== 'active') {
      throw new UnauthorizedException('Conta não ativada. Verifique seu email.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const { password: _password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
